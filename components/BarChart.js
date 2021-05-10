import { useContext } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { useRouter } from 'next/router'
import { UserContext, PrimaryChartContext } from "../context"
import { Box, Text } from '@chakra-ui/react'

export default function BarChart({ data, fromDate, toDate }) {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { setPrimaryChart } = useContext(PrimaryChartContext)

  const theme = {
    "fontSize": 17,
    "tooltip": {
      "container": {
        "background": '#333',
      },
    },
  };

  function handleClick(e) {
    setPrimaryChart({
      area: e.label,
      from: fromDate,
      to: toDate
    })
    router.push(`/${user.name}/reports/breakdown`)
  }

  return <ResponsiveBar
    data={data}
    keys={['hot dog', 'burger']}
    indexBy="country"
    margin={{ top: 50, right: 30, bottom: 150, left: 30 }}
    innerPadding={1}
    padding={0.3}
    groupMode="grouped"
    layout="vertical"
    valueScale={{ type: 'linear' }}
    indexScale={{ type: 'band', round: true }}
    colors={{ scheme: 'nivo' }}
    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    axisRight={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: '', legendOffset: 0 }}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
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
    enableGridX={true}
    enableGridY={false}
    labelSkipWidth={5}
    labelSkipHeight={12}
    labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
    legends={[]}
    //tooltip={function () { }}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
  />
}