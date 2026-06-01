import React from 'react';

const Metrics = () => (
  <div className="mt-8 pt-6 border-t border-gray-700 grid grid-cols-3 gap-4 text-white">
    {/* Metric 1: Accuracy */}
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-cyan-400">98.7%</p>
      <p className="text-sm text-gray-400 mt-1">Accuracy</p>
    </div>
    
    {/* Metric 2: Scan Time */}
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-cyan-400">&lt;10m</p>
      <p className="text-sm text-gray-400 mt-1">Scan Time</p>
    </div>
    
    {/* Metric 3: Files Analyzed */}
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-bold text-cyan-400">10K+</p>
      <p className="text-sm text-gray-400 mt-1">Files Analyzed</p>
    </div>
  </div>
);

export default Metrics;