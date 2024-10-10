import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Query from '@arcgis/core/rest/support/Query';

import '@arcgis/core/assets/esri/themes/light/main.css';

const App = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    const webMap = new WebMap({
      basemap: 'topo-vector',
    });

    const view = new MapView({
      container: mapDiv.current,
      map: webMap,
      center: [34.8516, 31.0461], // Longitude, Latitude of Israel
      zoom: 7,
    });

    const capitalCitiesLayer = new FeatureLayer({
      url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Cities/FeatureServer/0',
      definitionExpression: "STATUS IN ('National and provincial capital', 'National capital')",      
      renderer: {
        type: 'simple',
        symbol: {
          type: 'simple-marker',
          color: 'red',
          size: 8,
        },
      },
      popupTemplate: {
        title: '{CITY_NAME}',
        content: [
          {
            type: 'fields',
            fieldInfos: [
              {
                fieldName: 'CITY_NAME',
                label: 'City Name',
              },
              {
                fieldName: 'POP',
                label: 'Population',
                format: {
                  digitSeparator: true,
                  places: 0,
                },
              },
            ],
          },
        ],
      },
    });

    webMap.add(capitalCitiesLayer);
    
    // Query to for debugging and finding the correct definition
    //
    const query = new Query({
      where: '1=1',
      outFields: ['STATUS'],
      returnDistinctValues: true,
      returnGeometry: false,
    });
    
    capitalCitiesLayer.queryFeatures(query).then((result) => {
      const uniqueStatuses = result.features.map((feature) => feature.attributes.STATUS);
      const uniqueValues = [...new Set(uniqueStatuses)];
      console.log('Unique STATUS values:', uniqueValues);
    });
    //
    
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, []);

  return <div style={{ height: '100vh', width: '100%' }} ref={mapDiv}></div>;
};

export default App;
