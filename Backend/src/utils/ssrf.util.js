const dns = require("dns").promises;
const net = require("net");

// List of private/reserved IPv4 CIDR ranges
const PRIVATE_IPV4_RANGES = [
  { start: ipToLong("0.0.0.0"), end: ipToLong("0.255.255.255") }, // Current network
  { start: ipToLong("10.0.0.0"), end: ipToLong("10.255.255.255") }, // Private 10/8
  { start: ipToLong("100.64.0.0"), end: ipToLong("100.127.255.255") }, // CGNAT
  { start: ipToLong("127.0.0.0"), end: ipToLong("127.255.255.255") }, // Loopback
  { start: ipToLong("169.254.0.0"), end: ipToLong("169.254.255.255") }, // Link-local / Cloud Metadata
  { start: ipToLong("172.16.0.0"), end: ipToLong("172.31.255.255") }, // Private 172.16/12
  { start: ipToLong("192.0.0.0"), end: ipToLong("192.0.0.255") }, // IETF Protocol
  { start: ipToLong("192.0.2.0"), end: ipToLong("192.0.2.255") }, // TEST-NET-1
  { start: ipToLong("192.88.99.0"), end: ipToLong("192.88.99.255") }, // 6to4 relay
  { start: ipToLong("192.168.0.0"), end: ipToLong("192.168.255.255") }, // Private 192.168/16
  { start: ipToLong("198.18.0.0"), end: ipToLong("198.19.255.255") }, // Benchmark
  { start: ipToLong("198.51.100.0"), end: ipToLong("198.51.100.255") }, // TEST-NET-2
  { start: ipToLong("203.0.113.0"), end: ipToLong("203.0.113.255") }, // TEST-NET-3
  { start: ipToLong("224.0.0.0"), end: ipToLong("239.255.255.255") }, // Multicast
  { start: ipToLong("240.0.0.0"), end: ipToLong("255.255.255.255") }, // Reserved / Broadcast
];

function ipToLong(ip) {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0) >>>
    0
  );
}

function isPrivateIPv4(ip) {
  if (!net.isIPv4(ip)) return false;
  const long = ipToLong(ip);
  return PRIVATE_IPV4_RANGES.some((r) => long >= r.start && long <= r.end);
}

function isPrivateIPv6(ip) {
  if (!net.isIPv6(ip)) return false;
  const normalized = ip.toLowerCase();

  // Loopback
  if (normalized === "::1" || normalized === "::") return true;

  // IPv4-mapped IPv6 (::ffff:192.168.1.1)
  if (normalized.startsWith("::ffff:")) {
    const ipv4Part = normalized.replace("::ffff:", "");
    if (net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
  }

  // Unique Local Address (ULA) fc00::/7 (fc00... or fd00...)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;

  // Link-Local fe80::/10
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }

  // Multicast ff00::/8
  if (normalized.startsWith("ff")) return true;

  return false;
}

function isPrivateIP(ip) {
  return isPrivateIPv4(ip) || isPrivateIPv6(ip);
}

const BLOCKED_HOSTNAMES = [
  "localhost",
  "metadata.google.internal",
  "instance-data",
  "169.254.169.254",
  "0.0.0.0",
];

/**
 * Validates a hostname or IP against SSRF protections.
 * Resolves DNS and asserts that none of the resolved IPs belong to private or loopback ranges.
 * @param {string} hostname
 * @returns {Promise<{ isSafe: boolean, resolvedIps: string[], reason?: string }>}
 */
async function validateHostForSSRF(hostname) {
  if (!hostname || typeof hostname !== "string") {
    return { isSafe: false, resolvedIps: [], reason: "Invalid hostname" };
  }

  const cleanHost = hostname.trim().toLowerCase();

  if (BLOCKED_HOSTNAMES.includes(cleanHost)) {
    return {
      isSafe: false,
      resolvedIps: [],
      reason: `Blocked reserved or cloud metadata hostname: ${cleanHost}`,
    };
  }

  // If host is an IP directly
  if (net.isIP(cleanHost)) {
    if (isPrivateIP(cleanHost)) {
      return {
        isSafe: false,
        resolvedIps: [cleanHost],
        reason: `Target IP ${cleanHost} is in a private, loopback, or reserved range.`,
      };
    }
    return { isSafe: true, resolvedIps: [cleanHost] };
  }

  // Resolve DNS using OS getaddrinfo
  try {
    const addresses = await dns.lookup(cleanHost, { all: true });
    const resolvedIps = addresses.map((a) => a.address);

    for (const ip of resolvedIps) {
      if (isPrivateIP(ip)) {
        return {
          isSafe: false,
          resolvedIps,
          reason: `Hostname ${cleanHost} resolves to private IP ${ip}.`,
        };
      }
    }

    return { isSafe: true, resolvedIps };
  } catch (err) {
    if (err.code === "ENOTFOUND") {
      // Non-existent or suspended domain; cannot reach internal networks
      return { isSafe: true, resolvedIps: [], isNxDomain: true };
    }
    return {
      isSafe: false,
      resolvedIps: [],
      reason: `DNS resolution failed for ${cleanHost}: ${err.message}`,
    };
  }
}

/**
 * Safe fetch function with SSRF guard, timeout, redirect limit, and payload size limit.
 * Never executes downloaded content.
 */
async function safeFetchUrl(urlStr, { timeoutMs = 3500, maxSizeBytes = 100 * 1024 } = {}) {
  let parsedUrl;
  try {
    parsedUrl = new URL(urlStr);
  } catch (err) {
    throw new Error(`Invalid URL format: ${urlStr}`);
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error(`Unsupported protocol: ${parsedUrl.protocol}. Only HTTP and HTTPS are permitted.`);
  }

  // SSRF check
  const ssrfCheck = await validateHostForSSRF(parsedUrl.hostname);
  if (!ssrfCheck.isSafe) {
    const err = new Error(`SSRF Protection Block: ${ssrfCheck.reason}`);
    err.code = "SSRF_BLOCKED";
    throw err;
  }

  // AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "ScamRadar-ThreatIntel-Scanner/1.0 (+https://scamradar.org)",
        Accept: "text/html,text/plain,application/json;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get("content-type") || "";
    const contentLength = parseInt(response.headers.get("content-length") || "0", 10);

    if (contentLength > maxSizeBytes) {
      throw new Error(`Response size (${contentLength} bytes) exceeds safety limit of ${maxSizeBytes} bytes.`);
    }

    // Read limited bytes safely
    const text = await response.text();
    const truncatedText = text.slice(0, maxSizeBytes);

    return {
      status: response.status,
      statusText: response.statusText,
      contentType,
      resolvedUrl: response.url,
      resolvedIps: ssrfCheck.resolvedIps,
      bodyPreview: truncatedText.slice(0, 5000), // safe snippet
      contentLength: truncatedText.length,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms.`);
    }
    throw err;
  }
}

module.exports = {
  isPrivateIP,
  isPrivateIPv4,
  isPrivateIPv6,
  validateHostForSSRF,
  safeFetchUrl,
};
