import { compose, reduce, concat, merge, isNil, prop, map, objOf, path } from 'ramda'
import {
    Component,
    fold,
    nothing,
    branch,
    injectStyleSheet,
    toContainer,
} from '../common/component'
import { vegaChart, timebarChartSpec } from '../common/charts'
import 'bootstrap/dist/css/bootstrap.min.css'

const styles = {
    title: { color: 'white' },
    container: { paddingTop: 20 }
}

const nothingWhenNoData = branch(compose(isNil, prop('data')), nothing())

const chart = vegaChart.contramap(props => merge({
    width: window.innerWidth - 120,
    spec:  timebarChartSpec({
        yDomain: props.yDomain,
        yTitle: props.yTitle,
        mark: props.mark,
        nominalField: props.nominalField,
        data: compose(
            objOf('values'),
            reduce(concat, []),
            map(metricData => map(merge({ [props.nominalField]: metricData.metric.labels[props.nominalField] }), metricData.values)))(
            props.data),
    }),
    title: props.title
}, props))

export default Component(props => compose(
    fold(props),
    injectStyleSheet(styles),
    map(toContainer({ className: path(['classes', 'container'])})),
    reduce(concat, nothing()))(
    [nothingWhenNoData(chart)]))
