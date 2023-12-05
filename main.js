window.onload = init;

var stylesEbiA = {
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [2, 126, 153, 0.3]
            }),
            stroke: new ol.style.Stroke({color: '#027e99', width: 1})
        })
    })],
};

var styleFunctionEbiA = function(feature, resolution) {
  return stylesEbiA[feature.getGeometry().getType()];
};

var stylesEbiB = {
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: [255, 212, 0, 0.9]
            }),
            stroke: new ol.style.Stroke({color: '#ffd400', width: 1})
        })
    })],
};

var styleFunctionEbiB = function(feature, resolution) {
  return stylesEbiB[feature.getGeometry().getType()];
};

function init(){

    proj4.defs("EPSG:2056","+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs");
    ol.proj.proj4.register(proj4);

    const map = new ol.Map({
        view: new ol.View({
            center: [8.58, 47.45],
            zoom: 13,
            projection: 'EPSG:4326'
        }),
        target: "map",
        KeyboardEventTarget: document
    })

    // basic layer
    const OSMLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true,
        title: 'OSMLayer'
    })
    map.addLayer(OSMLayer)

    // add wms layers
    // Landeskarte
    const Swisstopo = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'https://wms.geo.admin.ch', 
            attributions: 'Bundesamt für Landestopografie swisstopo',
            params: {
                LAYERS: 'ch.swisstopo.landeskarte-grau-10',
                FORMAT: 'image/png',
                //TRANSPARENT: true
            }
        }
        ),
        visible: false,
        title: 'Swisstopo'
    })
    map.addLayer(Swisstopo)

    const GemeindeStyles = function(feature){
        let geometryType = feature.getGeometry().getType();
        let GemeindeName = feature.get('Gemeinde');
        let ZonenKat = feature.get('Zone');
        
        // Textstyle
        let GemeindeString = GemeindeName.tostring();
        
        let textStyles = new ol.style.Style({
            text: new ol.style.Text({
                text: GemeindeString,
                scale: 1.5,
                fill: new ol.style.Fill({
                    color: [18, 18, 18, 1]
                })
            })
        })

        if(geometryType === 'MultiPolygon'){
            feature.setStyle([textStyles])
        }
    
    }


    //GeoJSON Kernzonen
    const EbiZonen = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.KML({
                extractStyles: true,
                extractAttributes: true,
            
            }),
            url: 'data/Zonen.kml'
        }),
        visible: false,
        title: 'Zonen',
        opacity: 0.6,
        style: GemeindeStyles
        })
    
    map.addLayer(EbiZonen)

    const newLineStyle = new ol.style.Style({
        stroke:new ol.style.Stroke({
            color: [255, 1, 103, 1],
            width: 5,
             lineDash: [3, 6]
          })
    })

    //GeoJSON BTV
    const BTV = new ol.layer.Vector({
    source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: 'data/BTV_Grenze.geojson'
    }),
    visible: false,
    title: 'BTV',
    style: newLineStyle
    })
    map.addLayer(BTV)

    //GeoJSON Points EbiA
    const geoJSONEbiA = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'data/ebiA.geojson'
        }),
        visible: false,
        title: 'geoJSONEbiA',
        style: styleFunctionEbiA
    })
    map.addLayer(geoJSONEbiA)

    //GeoJSON Points EbiB
    const geoJSONEbiB = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'data/ebiB.geojson'
        }),
        visible: false,
        title: 'geoJSONEbiB',
        style: styleFunctionEbiB
    })
    map.addLayer(geoJSONEbiB)





    // const AKStyle = new ol.style.Style({
    //     fill: new ol.style.Fill({
    //         color: [227, 26, 28, 0.6]
    //     }),
    //     stroke:new ol.style.Stroke({
    //         color: [0, 0, 0, 1],
    //         width: 2
    //     })
    // })

    // const KZStyle = new ol.style.Style({
    //     fill: new ol.style.Fill({
    //         color: [255, 127, 0, 0.6]
    //     }),
    //     stroke:new ol.style.Stroke({
    //         color: [0, 0, 0, 1],
    //         width: 2
    //     })
    // })

    // const KZeStyle = new ol.style.Style({
    //     fill: new ol.style.Fill({
    //         color: [245, 234, 13, 0.6]
    //     }),
    //     stroke:new ol.style.Stroke({
    //         color: [0, 0, 0, 1],
    //         width: 2
    //     })
    // })





    // // Kantonsgrenzen
    // const Locations = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'http://localhost:8080/geoserver/locations/wms?', 
    //         attributions: '@geoserver',
    //         params: {
    //             LAYERS: 'locations:locations',
                
    //             //TRANSPARENT: true
    //         }
    //     }
    //     ),
    //     visible: false,
    //     title: 'Locations',
    //     style: styleFunctionEbiB
    // })
    // map.addLayer(Locations)

    // // Kantonsgrenzen
    // const Kantonsgrenzen = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'https://wms.geo.admin.ch', 
    //         attributions: 'Bundesamt für Landestopografie swisstopo',
    //         params: {
    //             LAYERS: 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill',
    //             FORMAT: 'image/png',
    //             //TRANSPARENT: true
    //         }
    //     }
    //     ),
    //     visible: false,
    //     title: 'Kantonsgrenzen'
    // })
    // map.addLayer(Kantonsgrenzen)

    // // Vorlage WMS
    // const NAME = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'URL', 
    //         attributions: 'Quellenangabe',
    //         params: {
    //             LAYERS: 'NAME aus get capabilities',
    //             FORMAT: 'image/png',
    //             //TRANSPARENT: true
    //         }
    //     }
    //     ),
    //     visible: false,
    //     title: 'NAME=HTML'
    // })
    // map.addLayer(NAME)


    // //Denkmalschutz ZH
    // const DenkmalschutzZH = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'https://wms.zh.ch/DenkmalschutzWMS', 
    //         attributions: 'Geoportal Kt. ZH',
    //         params: {
    //             LAYERS: 'denkmalschutzobjekte-kanton-zuerich',
    //             FORMAT: 'image/png',
    //             //TRANSPARENT: true
    //         }
    //     }
    //     ),
    //     visible: false,
    //     title: 'DenkmalschutzZH'
    // })
    // map.addLayer(DenkmalschutzZH)
    
    // //Bohrungen SO
    // const BohrungenSO = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'https://geo.so.ch/api/wms?', 
    //         attributions: 'Geoportal Kt. SO',
    //         params: {
    //             LAYERS: 'ch.so.afu.wasserbewirtschaftung.sondierung',
    //             FORMAT: 'image/png',
    //             //TRANSPARENT: true
    //         }
    //     }
    //     ),
    //     visible: false,
    //     title: 'BohrungenSO'
    // })
    // map.addLayer(BohrungenSO)

    // //Bohrungen BL
    // const BohrungenBL = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'https://wms.geo.bs.ch/', 
    //         attributions: 'Geoportal Kt. BS',
    //         params: {
    //             LAYERS: 'Bohrkataster',
    //             FORMAT: 'image/png',
    //             //TRANSPARENT: true
    //         }
    //     }
    //     ),
    //     visible: false,
    //     title: 'BohrungenBL'
    // })
    // map.addLayer(BohrungenBL) 

    // // GEbäuderegister
    // const GWR = new ol.layer.Tile({
    //     source: new ol.source.TileWMS({
    //         url: 'https://wms.geo.admin.ch', 
    //         attributions: 'Bundesamt für Landestopografie swisstopo',
    //         params: {
    //             LAYERS: 'ch.bfs.gebaeude_wohnungs_register',
    //             FORMAT: 'image/png',
    //             //TRANSPARENT: true
    //         }
    //     }
    //     ),
    //     visible: false,
    //     title: 'GWR'
    // })
    // map.addLayer(GWR)


    // Control Panels for Map
    const scaleLineControl = new ol.control.ScaleLine({
        bar: true,
        text: true
    });
    map.addControl(scaleLineControl);

    const fullScreenControl = new ol.control.FullScreen();
    map.addControl(fullScreenControl);

    const zoomSliderControl = new ol.control.ZoomSlider();
    map.addControl(zoomSliderControl);

    const zoomToExtentControl = new ol.control.ZoomToExtent();
    map.addControl(zoomToExtentControl);

   
    // adding a box to zoom
    const dragBoxInteraction  = new ol.interaction.DragBox({
        condition: ol.events.condition.altKeyOnly
    })
    map.addInteraction(dragBoxInteraction);

    dragBoxInteraction.on('boxend', function(){
        var boxExtend = dragBoxInteraction.getGeometry().getExtent();
        map.getView().fit(boxExtend);
    })


   // action on click map layers, set map visible on click
    const baseLayerElements = document.querySelectorAll('#grid1 > input[type = radio]')
    for (let baseLayerElement of baseLayerElements){
        baseLayerElement.addEventListener('change', function(){
            let elementValue = this.value;
            map.getLayers().forEach(element => {
                let elementTitle = element.get('title');
                if (elementValue === elementTitle){
                    element.setVisible(true);
                } else {
                    element.setVisible(false);    
                }
            })
        }
    )}

    const overlayLayerElements = document.querySelectorAll('#grid1 > input[type = checkbox]')
    for (let overlayLayerElement of overlayLayerElements){
        overlayLayerElement.addEventListener('change', function(){
            let overlayelementValue = this.value;
            map.getLayers().forEach(element => {
                let overlayelementTitle = element.get('title');
                if (overlayelementValue === overlayelementTitle){
                    element.setVisible(! element.getVisible());
                } 
            })
        })
    }

    const popupNameElement = document.getElementById("p-number");
    const popupRankElement = document.getElementById("p-name");

    const popupContainreElement = document.getElementById("popup");
    const overlay = new ol.Overlay({
        element: popupContainreElement
    })
    map.on('click', function (e) {
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
            console.log(feature.get('ProjektNr'));
            console.log(feature.get('Projektname'));
            console.log(feature.get('Kunde'));
            console.log(feature.get('Status'));
            console.log(feature.get('Gemeinde'));
            console.log(feature.getGeometry().getType());
            
            const featureNumber = feature.get('ProjektNr');
            const featureName = feature.get('Projektname');
            const featureKunde = feature.get('Kunde');
            const featureStatus = feature.get('Status');
            const featurePL = feature.get('Projektleiter');
            const featureNetto = feature.get('Nettosumme');
            const featureAuftragEbiA = feature.get('Auftragssumme_EbiA');
            const featureOffertart = feature.get('Offertart');
            const featureGemeinde = feature.get('Gemeinde');

            map.addOverlay(overlay);

            popupNameElement.innerHTML = 
            '<p><strong><u>Allgemeine Angaben: </strong></u></p>' +
            '<p><strong>Projekt-Nummer: </strong>' + featureNumber + '</p>' +
            '<p><strong>Projekt-Name: </strong>' + featureName + '</p>' +
            '<p><strong>Kunde/Bauherr: </strong>' + featureKunde + '</p>' +
            '<p><strong>Projekt-Status: </strong>' + featureStatus + '</p>' +
            '<p><strong>Projektleiter: </strong>' + featurePL + '</p>' +
            '<p><strong><u>Spezifisch EbiB: </strong></u></p>' +
            '<p><strong>Nettosumme: </strong>' + featureNetto + '</p>' +
            '<p><strong>Auftragssumme EbiA: </strong>' + featureAuftragEbiA + '</p>' +
            '<p><strong>Offertart: </strong>' + featureOffertart + '</p>' +
            '<p><strong>Gemeinde: </strong>' + featureGemeinde + '</p>'
            ;

            overlay.setPosition(e.coordinate);
    
            const closer = document.getElementById('popup-closer');
            closer.onclick = function(){
                overlay.setPosition(undefined);
                close.blur();
                return false;
            };
            }
    )},
    
        )
}

