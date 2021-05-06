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
          fontSize: '27px',
          fontWeight: '400',
        }}
      >
        ${total}
      </text>
    )
  }

  return <ResponsivePie
    width={611}
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 70 }}
    innerRadius={0.3}
    padAngle={1}
    cornerRadius={3}
    activeInnerRadiusOffset={11}
    activeOuterRadiusOffset={7}
    borderWidth={2}
    borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
    arcLinkLabelsSkipAngle={1}
    arcLinkLabelsTextColor="#333333"
    arcLinkLabelsThickness={2}
    arcLinkLabelsDiagonalLength={16}
    arcLabelsSkipAngle={15}
    arcLinkLabelsColor={{ from: 'color' }}
    colors={{ datum: 'data.color' }}
    arcLabel={function (e) { return "$" + e.value }}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
    theme={theme}
    layers={['arcs', 'arcLabels', 'arcLinkLabels', CenteredMetric]}
    onClick={(n, e) => { console.log(n) }}
    tooltip={({ datum: { id, value, color } }) => (
      <div
        style={{
          padding: 12,
          color,
          background: '#222222',
        }}
      >
        <span>See Breakdown</span>
        <br />
        <strong>
          {id}: ${value}
        </strong>
      </div>
    )}
  />
}