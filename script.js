const url = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

const req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function () {
  const dataFromURL = JSON.parse(req.responseText);

  const svgTreeWidth = 1000;
  const svgTreeHeight = 600;
  const legendWidth = 900;
  const legendHeight = 300;
  const xAlignment = 10;
  const yAlignment = 17;
  const legendRectSize = 25;
  const color = [
  '#483D8B',
  '#1E90FF',
  '#00BFFF',
  '#00CED1',
  '#ADD8E6',
  '#E0FFFF',
  '#FFFFFF',
  '#DEB887',
  '#FFE4C4',
  '#B8860B',
  '#D2691E',
  '#FF8C00',
  '#FFB6C1',
  '#FF69B4',
  '#F08080',
  '#CD5C5C',
  '#708090',
  '#C0C0C0',
  '#E6E6FA',
  '#F0FFF0'];

  const colorMapping = d3.scaleOrdinal().
  range(color);
  const treemap = d3.treemap().
  size([svgTreeWidth, svgTreeHeight]).
  paddingInner(1);
  const theTree = d3.hierarchy(dataFromURL).
  eachBefore(function (d) {
    d.data.id = (d.parent ? d.parent.data.id + '.' : "") +
    d.data.name;
  }).
  sum(function (d) {
    return d.value;
  }).
  sort(function (a, b) {
    return d3.descending(a.value, b.value);
  });
  treemap(theTree);
  const svg = d3.select('#graph-container').
  attr('width', svgTreeWidth).
  attr('height', svgTreeHeight);

  const component = svg.selectAll('g').
  data(theTree.leaves()).
  enter().
  append('g').
  attr('transform', function (d) {
    return 'translate(' + d.x0 + ', ' + d.y0 + ')';
  });

  const tooltip = d3.select('body').
  append('div').
  attr('id', 'tooltip').
  style('opacity', 0);

  const categoryOfLeaves = theTree.leaves().
  map(function (d) {
    return d.data.category;
  });
  const categorySet = categoryOfLeaves.filter(function (val, i, arr) {
    return arr.indexOf(val) === i;
  });

  const legend = d3.select('#legend').
  attr('width', legendWidth).
  attr('height', legendHeight);

  const legendComponent = legend.selectAll('g').
  data(categorySet).
  enter().
  append('g').
  attr('transform', function (d, i) {
    return (
      'translate(' + i % 6 * 150 + ', ' +
      Math.floor(i / 6) * (legendRectSize + 50) +
      ')');

  });

  component.append('rect').
  attr('class', 'tile').
  attr('data-name', function (d) {
    return d.data.name;
  }).
  attr('data-category', function (d) {
    return d.data.category;
  }).
  attr('data-value', function (d) {
    return d.data.value;
  }).
  attr('data-id', function (d) {
    return d.data.id;
  }).
  attr('width', function (d) {
    return d.x1 - d.x0;
  }).
  attr('height', function (d) {
    return d.y1 - d.y0;
  }).
  style('fill', function (d) {
    return colorMapping(d.data.category);
  }).
  on('mouseover', function (e, d) {
    tooltip.transition().
    duration(100).
    style('opacity', 0.6);
    tooltip.attr('data-value', d.data.value);
    tooltip.html(
    'Name: ' + d.data.name + '<br/>' +
    'Platform: ' + d.data.category + '<br/>' +
    'Value: ' + d.data.value);


  }).
  on('mouseout', function () {
    tooltip.transition().
    duration(0).
    style('opacity', 0);
  });

  component.append('text').
  selectAll('tspan').
  data(function (d) {
    return d.data.name.split(/(?=[A-Z][^A-Z])/g);
  }).
  enter().
  append('tspan').
  attr('x', 2).
  attr('y', function (d, i) {
    return 10 + 10 * i;
  }).
  text(function (d) {
    return d;
  });

  legendComponent.append('rect').
  attr('width', legendRectSize).
  attr('height', legendRectSize).
  attr('class', 'legend-item').
  style('fill', function (d) {
    return colorMapping(d);
  });

  legendComponent.append('text').
  text(d => d).
  attr('x', legendRectSize + xAlignment).
  attr('y', yAlignment).
  style('font-size', 15);

};