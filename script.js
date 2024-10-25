// Define the dimensions and margins of the chart
const width = window.innerWidth * 0.7;
const height = 400;
const margin = { top: 20, right: 30, bottom: 40, left: 50 };

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("display", "block") // Helps with centering using margin auto
  .style("margin", "0 auto"); // Center the SVG horizontally

// Define the x-scale for the hours (00:00 to 24:00)
const x = d3
  .scaleLinear()
  .domain([0, 24]) // Representing hours of the day in 24-hour format
  .range([0, width]);

// Add the x-axis to the plot
svg
  .append("g")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(
    d3
      .axisBottom(x)
      .ticks(24)
      .tickFormat((d) => `${d}:00`)
  )
  .attr("class", "x-axis"); // Add a class for styling

// Update styling for the x-axis
d3.selectAll(".x-axis path, .x-axis line") // Selects the axis line and tick lines
  .attr("stroke", "#ffffff") // Change the color of the axis and ticks
  .attr("stroke-width", 2); // Make the axis lines thicker for visibility

d3.selectAll(".x-axis text") // Selects the tick labels
  .style("fill", "#ffffff") // Change the color of the labels
  .style("font-size", "12px") // Adjust font size if needed
  .style("font-weight", "bold"); // Make the labels bold

// Define the zones and their corresponding positions
const zones = [
  { label: "Consistent Failure Zone", start: 0, end: 8, color: "#FF4C4C" },
  { label: "Danger Zone", start: 8, end: 10, color: "#FF8C42" },
  { label: "Reasonable Success", start: 10, end: 14, color: "#FFD700" },
  { label: "Consistent Success", start: 14, end: 20, color: "#4CAF50" },
];

// Add rectangles for each zone with tooltip
svg
  .selectAll("rect")
  .data(zones)
  .enter()
  .append("rect")
  .attr("x", (d) => x(d.start))
  .attr("y", (height - height * 0.7) / 2) // This will center the bars vertically
  .attr("width", (d) => x(d.end) - x(d.start) - 2) // Reduce width slightly for spacing
  .attr("height", height * 0.7) // This makes the bars 70% of the total height
  .attr("fill", (d) => d.color)
  .on("mouseover", function (event, d) {
    tooltip
      .style("visibility", "visible")
      .html(`<strong>${d.label}</strong><br>${getZoneDescription(d.label)}`);
  })
  .on("mousemove", function (event) {
    tooltip
      .style("top", `${event.pageY + 10}px`)
      .style("left", `${event.pageX + 10}px`);
  })
  .on("mouseout", function () {
    tooltip.style("visibility", "hidden");
  });

// Define the 2-hour interval times (in 24-hour format) starting from 6am to 8pm
const twoHourIntervals = [6, 8, 10, 12, 14, 16, 18, 20];

// Add dashed lines for each 2-hour interval
svg
  .selectAll(".interval-line")
  .data(twoHourIntervals)
  .enter()
  .append("line")
  .attr("x1", (d) => x(d)) // Position the start of the line at the corresponding hour
  .attr("x2", (d) => x(d)) // Position the end of the line at the corresponding hour
  .attr("y1", 0) // Start line from the top of the SVG
  .attr("y2", height) // Draw the line to the bottom of the SVG
  .attr("stroke", "lightblue") // Set line color to light blue
  .attr("stroke-width", 2) // Set line thickness
  .attr("stroke-dasharray", "4 4"); // Create a dashed effect with "4 4" (4px dash, 4px gap)

// Add labels for each zone
svg
  .selectAll(".zone-label")
  .data(zones)
  .enter()
  .append("text")
  .attr("x", (d) => (x(d.start) + x(d.end)) / 2)
  .attr("y", 100) // Adjust this as needed
  .attr("text-anchor", "middle")
  .each(function (d) {
    const textElement = d3.select(this);

    if (d.label === "Danger Zone") {
      // Add two lines for "Danger Zone"
      textElement
        .append("tspan")
        .attr("x", (x(d.start) + x(d.end)) / 2)
        .attr("dy", 0) // No vertical offset for the first line
        .text("Danger");

      textElement
        .append("tspan")
        .attr("x", (x(d.start) + x(d.end)) / 2)
        .attr("dy", "1.2em") // Vertical offset for the second line
        .text("Zone");
    } else {
      // Add single-line labels for other zones
      textElement.text(d.label);
    }
  })
  .attr("fill", "#000")
  .style("font-size", "14px")
  .style("font-weight", "bold");

// Select the tooltip div
const tooltip = d3.select("#tooltip");

// Function to return detailed zone descriptions based on the zone label
function getZoneDescription(label) {
  switch (label) {
    case "Consistent Failure Zone":
      return "This zone represents the early hours where starting to eat consistently leads to poor results. Due to an increased number of meals spread throughout the day, this window is strongly associated with weight gain and a loss of control over meal frequency.";
    case "Danger Zone":
      return "This window poses a high risk of inconsistency. Eating in these hours often results in an additional meal that disrupts the eating schedule. While it’s possible to maintain control, this zone can easily lead to hunger and a higher meal count.";
    case "Reasonable Success":
      return "This window represents a period where timing aligns well with the goal of consuming only 3 meals per day. Eating in this window has shown a higher likelihood of successful adherence to the planned meal count and contributes to weight loss.";
    case "Consistent Success":
      return "This zone aligns with the eating pattern that brought consistent results in Egypt. Starting meals later in the day allows for better control over hunger and meal frequency, making it easier to maintain a leaner physique and avoid overeating.";
    default:
      return "";
  }
}

// Create a keyGroup to hold the rectangle and text together
const keyGroup = svg
  .append("g")
  .attr("transform", "translate(1000, 100)") // Adjust this translation to position the key where you want
  .style("opacity", 0); // Initially hidden
// Add the key rectangle with rounded corners
keyGroup
  .append("rect")
  .attr("width", 220) // Width of the key box
  .attr("height", 60) // Height of the key box
  .attr("rx", 10) // Rounded corners
  .attr("ry", 10) // Rounded corners
  .attr("fill", "#ffffff") // Background color of the key box
  .attr("stroke", "#000") // Border color of the key box
  .attr("stroke-width", 1); // Border width

// Add text to the key box
keyGroup
  .append("text")
  .attr("x", 10) // X-offset within the box
  .attr("y", 20) // Y-offset within the box for the first line
  .attr("text-anchor", "start")
  .attr("fill", "#000") // Text color
  .style("font-size", "12px")
  .text("Average meals per day =");

// Add the calculation part of the key box
keyGroup
  .append("text")
  .attr("x", 10) // X-offset within the box for the second line
  .attr("y", 40) // Y-offset for the second line of text
  .attr("text-anchor", "start")
  .attr("fill", "#000") // Text color
  .style("font-size", "12px")
  .text((4 + 4 + 1 + 3 + 3 + 4 + 3 + 3) / 8);

// Select the title element
d3.select("#plot-title")
  .on("mouseover", function () {
    // On mouseover, show the key group
    keyGroup.transition().duration(200).style("opacity", 1);
  })
  .on("mouseout", function () {
    // On mouseout, hide the key group
    keyGroup.transition().duration(200).style("opacity", 0);
  });
