
// width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));  
var height = width - width / 3.9;
var margin = 20;
var labelArea = 110;
var textPadBottom = 40;
var textPadLeft = 40;

// Create the canvas for the graph
var svg = d3.select("#scatter") 
            .append("svg") 
            .attr("width", width) 
            .attr("height", height) 
            .classed("chart", true); 
console.log(svg)

// mobility section
var circleRadius;
function getCircleRadius() {
  if (width <= 530) {  
    circleRadius = 5; 
  }
  else { 
    circleRadius = 10; 
  }
}
getCircleRadius();


//  a group element to nest our bottom axes labels.
var xText = svg.append("g"); 

//  width of the window changes.
function xTextRefresh() {
  xText.attr("transform",
            `translate(${((width - labelArea) / 2 + labelArea)},${(height - margin - textPadBottom)})`
  );
}
xTextRefresh();


//  Poverty
xText.append("text") 
     .attr("y", -26) 
     .attr("data-name", "poverty") 
     .attr("data-axis", "x") 
     .classed("axisText active x", true) 
     .text("In Poverty(%)"); 

//  Age
xText.append("text") 
     .attr("y", 0) // set the "y" attribute to 0
     .attr("data-name", "age(Median)") // set the 'data-name' attribute to 'age'
     .attr("data-axis", "x") // set the data-axis attribute to 'x'
     .classed("axisText inactive x", true) // give it class of axisText, inactive, and x
     .text("Age(Median)"); // set the text to be a human readable label

// Income
xText.append("text") // append a "text" element to the xText group
      .attr("y", 26) // set the "y" attribute to 26
      .attr("data-name", "Household income(Median)") // set the 'data-name' attribute to 'income'
      .attr("data-axis", "x") // set the data-axis attribute to 'x'
      .classed("axisText inactive x", true) // give it class of axisText, inactive, and x
      .text("Household Income(Median)"); // set the text to be a human readable label

// Left Axis


// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + textPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
var yText = svg.append("g") // append a 'g' element to the svg
               .classed("yText", true); //give it a class of yText

// Like before, we nest the group's transform attr in a function
// to make changing it on window change an easy operation.
function yTextRefresh() {
  yText.attr("transform", `translate(${leftTextX}, ${leftTextY})rotate(-90)`);
}
yTextRefresh();

// Now we append the text.
// 1. Obesity
yText.append("text") // append a "text" element to the yText group
      .attr("y", -26) // set the "y" attribute to -26
      .attr("data-name", "obesity(%)") // set the 'data-name' attribute to 'obesity'
      .attr("data-axis", "y") // set the data-axis attribute to 'y'
      .classed("axisText active y", true) // give it class of axisText, active, and y
      .text("Obesity(%)"); // set the text to be a human readable label

// 2. Smokes
yText.append("text") // append a "text" element to the yText group
      .attr("y", 0) // set the "y" attribute to 0
      .attr("data-name", "smokes(%)") // set the 'data-name' attribute to 'smokes'
      .attr("data-axis", "y") // set the data-axis attribute to 'y'
      .classed("axisText inactive y", true) // give it class of axisText, inactive, and y
      .text("Smokes(%)"); // set the text to be a human readable label

// 3. Lacks Healthcare
yText.append("text") // append a "text" element to the yText group
      .attr("y", 26) // set the "y" attribute to 26
      .attr("data-name", "healthcare") // set the 'data-name' attribute to 'healthcare'
      .attr("data-axis", "y") // set the data-axis attribute to 'y'
      .classed("axisText inactive y", true) // give it class of axisText, inactive, and y
      .text("Lacks Healthcare (%)"); // set the text to be a human readable label
      

// Import CSV data with d3's .csv import method.
d3.csv("assets/data/data.csv").then(function(data) {

  
  // Visualize the data
   visualize(data); 
  
});

//  Create our visualization function
function visualize(data) {

  // Variables and Functions
  
  var currentX = "poverty";
  var currentY = "obesity";

  // this will allow us to alter the values in functions and remove repetitious code.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // set up tooltip rules (see d3-tip.js).
  var toolTip = d3.tip() // create a d3.tip()
                  .attr("class", "d3-tip") 
                  .offset([-40, -60]) 
                  .html(function(d) { 
                    // x key
                    var theX;
                    //  the state name.
                    var theState = `<div>${d.state}</div>`;
                    //  the y value's key and value.
                    var theY = `<div>${currentY}: ${d[currentY]}%</div>`;
                    //  x key is poverty
                    if (currentX === "poverty") {
                      //  x key and a version of the value formatted to show percentage
                      theX = `<div>${currentX}: ${d[currentX]}%</div>`;
                    }
                    else {
                      // Otherwise
              
                      theX = `<div>${currentX}: ${parseFloat(d[currentX]).toLocaleString("en")}</div>`;
                    }
                    // Display what we capture.
                    return theState + theX + theY;
                  });
  // Call the toolTip function.
  svg.call(toolTip);

  
  


  // change the min and max for x
  function xMinMax() {
    
    xMin = d3.min(data, d => parseFloat(d[currentX]) * 0.85);
 
    // the largest datum from the selected column.
    xMax = d3.max(data, d => parseFloat(d[currentX]) * 1.05);
  }

  // change the min and max for y
  function yMinMax() {
    //  the smallest datum from the selected column.
    yMin = d3.min(data, d => parseFloat(d[currentY]) * 0.85);

    // the largest datum from the selected column.
    yMax = d3.max(data, d => parseFloat(d[currentY]) * 1.05);
  }

  // change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3.selectAll(".axisText") 
      .fiter(`.${axis}`) 
      .filter(".active") 
      .classed("active", false) 
      .classed("inactive", true); 

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false) 
               .classed("active", true); 
  }

  // Instantiate the Scatter Plot
  
  

  //  the min and max values of x and y.
  xMinMax();
  yMinMax();

  // T d3 to place our circles in an area starting after the margin and word area.
  var xScale =  d3.scaleLinear() 
                  .domain([xMin, xMax]) 
                  .range([margin + labelArea, width - margin]);
 
  var yScale = d3.scaleLinear() 
                 .domain([yMin, yMax]) 
                 .range([height - margin - labelArea, margin]);

  // pass the scales into the axis methods to create the axes.
 
  var xAxis = d3.axisBottom(xScale); 
  var yAxis = d3.axisLeft(yScale); 

  
  function tickCount() { // create function called tickCount() that takes no arguments
    if(width <= 500) { 
      xAxis.ticks(5); 
      yAxis.ticks(5); 
    }
    else { 
      xAxis.ticks(10); 
      yAxis.ticks(10); 
    }
  }
  tickCount(); 

  
  
  // The transform attribute 
  svg.append("g") 
      .call(xAxis) 
      .attr("class", "xAxis") 
      .attr("transform", `translate(0,${(height - margin - labelArea)})`);

  svg.append("g") 
      .call(yAxis) 
      .attr("class", "yAxis")
      .attr("transform", `translate(${(margin + labelArea)}, 0)`);

  //  make a grouping for our dots and their labels.
  var circlesGroup = svg.selectAll('g cirlesGroup') 
                      .data(data) 
                      .enter() 

  circlesGroup.append("circle") 
            
            .attr("cx", d => xScale(d[currentX])) 
            .attr("cy", d => yScale(d[currentY])) 
            .attr("r", circleRadius) 
            .attr("class", d => `${d.abbr} stateCircle`) 
            .on("mouseover", function(d) { 
              // use tooltip
              toolTip.show(d, this); 
              // the state circle's border
              d3.select(this).style("stroke", "#ffb3ff"); 
              
            })
            .on("mouseout", function(d) { 
            
            });

  
  circlesGroup.append("text") // append a 'text' element to circlesGroup
              
              .text(d => d.abbr) // set the .text() to map from d => d.abbr
              // place the text using our scale.
              .attr("dx", d => xScale(d[currentX])) 
            
              .attr("dy", d =>yScale(d[currentY]) + circleRadius / 2.5) 
              .attr("font-size", circleRadius) 
              .attr("class", d => `${d.abbr} stateText`) 
              .on("mouseover", function(d) { 
                // Show the tooltip
                toolTip.show(d, this); // use toolTip.show() 
                // the state text's border
                d3.select(this).style("stroke", "red"); 
              })
              .on("mouseout", function(d) { 
            
              });

  //  Graph Dynamic


  // Select all axis text and add this d3 click event.
  d3.selectAll(".axisText").on("click", function() {
    
    var selectedLabel = d3.select(this); 

    if (selectedLabel.classed("inactive")) { 
      // the name and axis saved in label.
      var axis = selectedLabel.attr("data-axis"); 
      var name = selectedLabel.attr("data-name"); 

      // When x is the saved axis
      if (axis === "x") { 
        currentX = name;

        // Change the min and max of the x-axis
        xMinMax(); 

        // Update the domain of x.
        xScale.domain([xMin, xMax]); 

        // use a transition when we update the xAxis.
        d3.select(".xAxis") 
            .transition() 
            .duration(300) 
            .call(xAxis); 

        //  update the location of the state circles.
        d3.selectAll(".stateCircle").each(function() { 
          d3.select(this) 
            .transition() 
            .attr("cx", d => xScale(d[currentX])) 
            .duration(300); 
        });

        // change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() { // d3.selectAll() 
          d3.select(this) // d3.select(this)
            .transition() // transition
            .attr("dx", d => xScale(d[currentX])) 
            .duration(300); 
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, selectedLabel); // call the labelCahnge function with axis and selectedLabel as arguments
      }
      else { 
        // do all the same steps you just did for x, but this time do them for y
        currentY = name;
      
        yMinMax();

        yScale.domain([yMin, yMax]);

        d3.select(".yAxis")
          .transition()
          .duration(300)
          .call(yAxis);

        d3.selectAll(".stateCircle").each(function() {

          d3.select(this)
            .transition()
            .attr("cy", d => yScale(d[currentY]))
            .duration(300);
        });
        
        d3.selectAll(".stateText").each(function() {
          
          d3.select(this)
            .transition()
            .attr("dy", d => yScale(d[currentY]))
            .duration(300);
        });

        labelChange(axis, selectedLabel);

      }
    }
})

  // Mobile Responsive
  
  d3.select(window).on("resize", resizeChart) 
    
  // specify what specific parts of the chart need size and position changes.
  function resizeChart() { // define a function called resizeChart 
    // Redefine the width, height and leftTextY
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // the width and height to the svg 
    svg.attr("width", width) 
    svg.attr("height", height)

    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // update the axes (and the height of the x-axis)
    d3.select(".xAxis") 
        .call(xAxis) 
        .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    d3.select(".yAxis") 
      .call(yAxis) 
      .attr("transform", `translate(${(margin + labelArea)}, 0)`);

    // Update the ticks on each axis.
    tickCount(); 

    // labels.
    xTextRefresh(); 
    yTextRefresh(); 
                    

    // radius of each dot.
    getCircleRadius(); 

    // update the location and radius of the state circles.
    d3.selectAll(".stateCircle") 
      .attr("cy", d => yScale(d[currentY])) 
      .attr("cx", d => xScale(d[currentX])) 
      .attr("r", circleRadius * 1.5); 
  
    d3.selectAll(".stateText")
      .attr("dx", d => xScale(d[currentX]))
      .attr("dy", d => yScale(d[currentY]))
      .attr("style", `font-size:${circleRadius*1.0}px`);
  }
}