function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Using the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Using the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected with
  // dropdown menu
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Using d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Using `.html("") to clear any existing metadata
    PANEL.html("");

    // Using `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("b").text(`${key.toUpperCase()}`);
      PANEL.append("h5").text(`${value}`);
    });
 
  });
}

// Creating function to build gauge, bar and bubble chart the buildCharts function.
function buildCharts(sample) {
  // Using d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Created a variable that holds the samples array. 
    var sampleData = data.samples;
    // Created a variable that filters the samples for the object with the desired sample number.
    var chartArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    //  Created a variable that holds the first sample in the array.
    var firstArraySample = chartArray[0];

    // Created variables that hold the otu_ids, otu_labels, and sample_values.
    var Ids = firstArraySample.otu_ids;
    var Labels = firstArraySample.otu_labels;
    var sampleValues = firstArraySample.sample_values;

    // Created the yticks for the bar chart (Top 10 Bacterial species).
  

    var yticks = Ids.slice(0,10).map(OTU => "OTU " + OTU).reverse();

    // Created the trace for the bar chart. 
    var trace = {
      type: "bar",
      text: Labels.slice(0,10).reverse(),
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      orientation: 'h'
    };

    var barData = [trace];
    
    // Created the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacterial Species Found</b>"
      
    };
    // Using Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);




    // BUILDING BUBBLE CHART!
    var bubbleTrace = {
      x: Ids,
      y: sampleValues,
      mode: 'markers',
      hovertext: Labels,
      marker: {
        color: Ids,
        size: sampleValues,
        colorscale: "Earth"
      }
    };
    // Created the trace for the bubble chart.
    var bubbleData = [bubbleTrace];

    // Created the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      xaxis:{title: "OTU ID"},
      hovermode: 'closest',
    };

    // Using Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 





    // BUILDING GAUGE CHART!
    console.log(data);
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wFreq = result.wfreq;
    // Created the trace for the gauge chart.
    var trace2 = {
      
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
		  title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
      gauge: {
        axis: {range: [0,10],tickwidth: 3, tickcolor: "black"},
        bar: {color: "black"},
        steps: [
          { range: [0, 2], color: "#be1523" },
          { range: [2, 4], color: "#f9b234" },
          { range: [4, 6], color: "#feea12" },
          { range: [6, 8], color: "#94c11e" },
          { range: [8, 10], color: "#3caa33" },
        ],
      }
       };
    var gaugeData = [trace2];
    
    // Created the layout for the gauge chart.
    var gaugeLayout = { 
     
    };

    // Using Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
  
};




