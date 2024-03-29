import { ResponsivePie } from '@nivo/pie'
import { Box, Text } from '@chakra-ui/react'

export default function PieChart({ data, onClick }) {

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

  function ToolTip({ datum: { id, value } }) {
    return (
      <Box p={3}
        color="#FFFFFF"
        backgroundColor="#222222"
      >
        <Text fontSize="xl">
          {id}: ${value}
        </Text>
        <Text fontSize="xs">
          Click for Breakdown
        </Text>
      </Box>
    );
  }

  return <ResponsivePie
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
    arcLinkLabelsSkipAngle={15}
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
    onClick={(e) => onClick(e.label)}
    tooltip={ToolTip}
  />
}