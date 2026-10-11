import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { getMapReports } from '../api/reports.api';
import { useApi } from '../hooks/useApi';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import { Shield } from 'lucide-react';

const getRiskColor = (level) => {
  switch (level) {
    case 'HIGH': return '#ef4444';
    case 'MEDIUM': return '#f59e0b';
    case 'LOW': return '#10b981';
    default: return '#94a3b8';
  }
};

const MapPage = () => {
  const { data, loading, error, execute } = useApi(getMapReports);

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-0 px-0 flex flex-col">
      <div className="px-6 py-4 bg-slate-900 border-b border-white/10 z-10 shadow-md">
        <h1 className="text-2xl font-bold text-white mb-1">Scam Map</h1>
        <p className="text-slate-400 text-sm">Geographic distribution of reported scams</p>
      </div>
      
      <div className="flex-1 relative bg-slate-800">
        {loading && (
          <div className="absolute inset-0 z-20 p-6 flex flex-col gap-4 bg-slate-900">
            <LoadingSkeleton className="w-full h-full rounded-none" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900">
            <ErrorState message="Failed to load map data" onRetry={execute} />
          </div>
        )}
        
        <MapContainer 
          center={[20.5937, 78.9629]} 
          zoom={5} 
          className="w-full h-full z-0"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          {(Array.isArray(data?.data) ? data.data : data?.data?.reports || []).map((report) => (
            report.location?.latitude && report.location?.longitude && (
              <CircleMarker
                key={report._id || report.id}
                center={[report.location.latitude, report.location.longitude]}
                pathOptions={{ 
                  color: getRiskColor(report.riskLevel),
                  fillColor: getRiskColor(report.riskLevel),
                  fillOpacity: 0.6,
                  weight: 2
                }}
                radius={8}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                      <span className="font-bold text-gray-800 capitalize">{report.scamType.replace('_', ' ')}</span>
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: getRiskColor(report.riskLevel) + '30', color: getRiskColor(report.riskLevel) }}>
                        {report.riskLevel}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {report.location.city}, {report.location.state}
                    </div>
                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Score: {report.riskScore}/100
                    </div>
                    <Link 
                      to={`/reports/${report._id}`}
                      className="block w-full text-center bg-blue-600 text-white py-1.5 rounded text-sm font-medium hover:bg-blue-700"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </CircleMarker>
            )
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
