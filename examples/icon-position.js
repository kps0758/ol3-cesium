import OLCesium, {rotateAroundAxis, pickBottomPoint} from 'olcs';
import olView from 'ol/View.js';
import {defaults as olControlDefaults} from 'ol/control.js';
import olSourceOSM from 'ol/source/OSM.js';
import olLayerTile from 'ol/layer/Tile.js';
import olStyleText from 'ol/style/Text.js';
import olStyleIcon from 'ol/style/Icon.js';
import olStyleStyle from 'ol/style/Style.js';
import olGeomPoint from 'ol/geom/Point.js';
import olFeature from 'ol/Feature.js';
import olStyleStroke from 'ol/style/Stroke.js';
import {defaults as interactionDefaults} from 'ol/interaction.js';
import olStyleFill from 'ol/style/Fill.js';
import olMap from 'ol/Map.js';
import olSourceVector from 'ol/source/Vector.js';
import olLayerVector from 'ol/layer/Vector.js';


const icon1Feature = new olFeature({
  geometry: new olGeomPoint([700000, 200000])
});
icon1Feature.setStyle(new olStyleStyle({
  image: new olStyleIcon(/** @type {olx.style.IconOptions} */ ({
    anchor: [0.5, 1],
    src: 'data:image/png;base64,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',
  })),
  text: new olStyleText({
    text: 'Icon with anchor on the bottom center',
    stroke: new olStyleStroke({
      color: 'black',
      width: 3
    }),
    fill: new olStyleFill({
      color: 'white'
    })
  })
}));

const icon2Feature = new olFeature({
  geometry: new olGeomPoint([1000000, 200000])
});
icon2Feature.setStyle(new olStyleStyle({
  image: new olStyleIcon(/** @type {olx.style.IconOptions} */ ({
    src: 'data:image/png;base64,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'
  })),
  text: new olStyleText({
    text: 'Default positioning',
    stroke: new olStyleStroke({
      color: 'black',
      width: 3
    }),
    fill: new olStyleFill({
      color: 'white'
    })
  })
}));

const vectorSource = new olSourceVector({
  features: [
    icon1Feature,
    icon2Feature
  ]
});

const vectorLayer = new olLayerVector({
  source: vectorSource
});

const map = new olMap({
  interactions: interactionDefaults(),
  layers: [
    new olLayerTile({
      source: new olSourceOSM()
    }),
    vectorLayer
  ],
  target: 'map2d',
  controls: olControlDefaults({
    attributionOptions: {
      collapsible: false
    }
  }),
  view: new olView({
    center: [850000, 200000],
    zoom: 7
  })
});

const Cesium = window.Cesium;
const ol3d = new OLCesium({map, target: 'mapCesium'});
const scene = ol3d.getCesiumScene();
Cesium.createWorldTerrainAsync().then(tp => scene.terrainProvider = tp);
ol3d.setEnabled(true);

window['toggleClampToGround'] = function() {
  let altitudeMode;
  if (!vectorLayer.get('altitudeMode')) {
    altitudeMode = 'clampToGround';
  }
  vectorLayer.set('altitudeMode', altitudeMode);
  map.removeLayer(vectorLayer);
  map.addLayer(vectorLayer);
};

window['ol3d'] = ol3d;
window['scene'] = scene;
document.getElementById('enable').addEventListener('click', () => ol3d.setEnabled(!ol3d.getEnabled()));

ol3d.enableAutoRenderLoop();

// Tilt camera
const camera = scene.camera;
const pivot = pickBottomPoint(scene);
if (pivot) {
  const options = {};
  const transform = Cesium.Matrix4.fromTranslation(pivot);
  const axis = camera.right;
  rotateAroundAxis(camera, -Math.PI / 4, axis, transform, options);
}

//##REMOVE## Keep this tag, split code here for code sandbox

import {initCodeSandbox} from './_code-sandbox.js';
initCodeSandbox('rawjs/icon-position.js');
