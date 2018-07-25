import * as d3 from 'd3';
import { BaseType, Selection } from 'd3';

export default function createChart (options?, svg?: Selection<BaseType, {}, HTMLElement, any>) {
    const chart = Object.assign(
        {},
        {
            width: innerWidth,
            height: innerHeight,
            margin: {
                top: 20,
                right: 20,
                bottom: 100,
                left: 20
            }
        },
        options || {}
    );

    // console.log(svg);

    (<any>chart).svg = svg || d3.select('body')
        .append('svg')
        .attr('id', 'chart')
        .attr('width', chart.width - chart.margin.right)
        .attr('height', chart.height - chart.margin.bottom);

    (<any>window).svg = chart.svg;

    (<any>window).container = chart.svg.select('#container');

    // setTimeout(d => {
        (<any>chart).container =  ((chart.svg.select('#container').nodes.length > 1) ?
            chart.svg.selectAll('g#container') :
            chart.svg.append('g')
                        .attr('id', 'container')
            )
            .append('g')
            .attr('transform', `translate(${chart.margin.left}, ${chart.margin.top})`);
    // }, 1);

    (<any>chart).render = (renderFunction, data, clickFn = () => {}) => {

        console.log(data);

        renderFunction.apply(chart, [ data, clickFn ]);
    };

    return chart;
}
