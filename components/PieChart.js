import { ResponsivePie } from '@nivo/pie'

export default function PieChart({ data }) {
  const theme = {
    "fontSize": 17,
    "tooltip": {
      "container": {
        "background": '#333',
      },
    },
  };

  const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0
    dataWithArc.forEach(datum => {
      total += datum.value
    })

    return (
      <text
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '21px',
          fontWeight: '400',
        }}
      >
        ${total.toPrecision(6)}
      </text>
    )
  }

  return <ResponsivePie
    width={960}
    data={data}
    margin={{ top: 60, right: 200, bottom: 30, left: 200 }}
    startAngle={11}
    endAngle={371}
    innerRadius={0.3}
    padAngle={1}
    cornerRadius={3}
    activeInnerRadiusOffset={11}
    activeOuterRadiusOffset={7}
    borderWidth={2}
    borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
    arcLinkLabelsSkipAngle={6}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsDiagonalLength={16}
    arcLabelsSkipAngle={30}
    arcLinkLabelsColor={{ from: 'color' }}
    colors={{ datum: 'data.color' }}
    arcLabel={function (e) { return "$" + e.value }}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
    theme={theme}
    layers={['arcs', 'arcLabels', 'arcLinkLabels', CenteredMetric]}
    onClick={(n, e) => { console.log(n) }}
    tooltip={({ datum: { id, value } }) => (
      <div
        style={{
          padding: 12,
          color: '#FFFFFF',
          background: '#222222',
        }}
      >
        <span>Click for Breakdown</span>
        <br />
        <strong>
          {id}: ${value}
        </strong>
      </div>
    )}
  />
}