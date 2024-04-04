import OLCesium from 'olcs';
import {transform} from 'ol/proj.js';
import olView from 'ol/View.js';
import {defaults as olControlDefaults} from 'ol/control.js';
import olSourceOSM from 'ol/source/OSM.js';
import olLayerTile from 'ol/layer/Tile.js';
import olMap from 'ol/Map.js';

import {Image as ImageLayer} from 'ol/layer.js';
import {getCenter} from 'ol/extent.js';
import Static from 'ol/source/ImageStatic.js';

const imageExtent = [-40, 50, -10, 65];

const Cesium = window.Cesium;
const ol2d = new olMap({
  layers: [
    new olLayerTile({
      source: new olSourceOSM()
    }),
    new ImageLayer({
      source: new Static({
        url: 'data:image/png;base64,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',
        crossOrigin: '',
        projection: 'EPSG:4326',
        imageExtent
      })
    })
  ],
  controls: olControlDefaults({
    attributionOptions: {
      collapsible: false
    }
  }),
  target: 'mapCesium',
  view: new olView({
    center: transform(getCenter(imageExtent), 'EPSG:4326', 'EPSG:3857'),
    zoom: 4,
    projection: 'EPSG:3857'
  })
});

const ol3d = new OLCesium({
  map: ol2d
});
const scene = ol3d.getCesiumScene();
Cesium.createWorldTerrainAsync().then(tp => scene.terrainProvider = tp);
ol3d.setEnabled(true);


document.getElementById('enable').addEventListener('click', () => ol3d.setEnabled(!ol3d.getEnabled()));

//##REMOVE## Keep this tag, split code here for code sandbox

import {initCodeSandbox} from './_code-sandbox.js';
initCodeSandbox('rawjs/image-static.js');