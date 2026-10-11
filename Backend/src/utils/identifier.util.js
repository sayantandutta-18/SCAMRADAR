const normalizeIdentifier = (identifier, identifierType) => {
  if (!identifier || !identifierType) {
    throw new Error("Identifier and identifier type are required");
  }

  let normalized = identifier.trim();

  switch (identifierType) {
    case "PHONE":
      normalized = normalized.replace(/\D/g, "");

      if (normalized.startsWith("91") && normalized.length === 12) {
        normalized = normalized.slice(2);
      }

      break;

    case "UPI":
      normalized = normalized.toLowerCase();
      break;

    case "EMAIL":
      normalized = normalized.toLowerCase();
      break;

    case "URL":
      normalized = normalized.toLowerCase();

      try {
        const url = new URL(normalized);

        normalized = `${url.hostname}${url.pathname}`.replace(/\/$/, "");
      } catch (error) {
        throw new Error("Invalid URL");
      }

      break;

    case "SOCIAL_MEDIA":
      normalized = normalized.toLowerCase().replace(/\s/g, "");
      break;

    default:
      throw new Error("Unsupported identifier type");
  }

  return normalized;
};

module.exports = {
  normalizeIdentifier,
};