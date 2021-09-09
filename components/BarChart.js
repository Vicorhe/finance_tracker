import { ResponsiveBar } from '@nivo/bar'
import { Box, Text } from '@chakra-ui/react'

export default function BarChart({ data, onClick }) {
  function ToolTip({ id, value, color }) {
    return (
      <Box p={3}>
        <Text fontSize="xl">
          {id}: ${value}
        </Text>
        <Text fontSize="xs">
          Click for Breakdown
        </Text>
      </Box>
    );
  }

  return <ResponsiveBar
    data={data}
    keys={['period_one', 'period_two']}
    indexBy="area"
    margin={{ top: 56, right: 40, bottom: 130, left: 40 }}
    innerPadding={1}
    padding={0.3}
    groupMode="grouped"
    layout="vertical"
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={["#6785d0", "#b75fb3"]}
    axisRight={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: '', legendOffset: 0 }}
    axisBottom={{
      tickSize: 11,
      tickPadding: 7,
      tickRotation: 90,
      legend: '',
      legendPosition: 'middle',
      legendOffset: 32
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendPosition: 'middle',
      legendOffset: -40
    }}
    enableGridY={true}
    labelSkipWidth={40}
    labelTextColor="#f7f7ff"
    legends={[
      {
        dataFrom: 'keys',
        anchor: 'top-left',
        direction: 'row',
        justify: false,
        translateX: -29,
        translateY: -36,
        itemWidth: 77,
        itemHeight: 16,
        itemsSpacing: 17,
        symbolSize: 21,
        itemDirection: 'left-to-right'
      }
    ]}
    onClick={(e) => onClick(e.data.id, e.id === 'period_one')}
    tooltip={ToolTip}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
}