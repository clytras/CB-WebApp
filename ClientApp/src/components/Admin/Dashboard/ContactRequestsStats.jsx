import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, CartesianGrid, LineChart, Line, XAxis, YAxis, AreaChart, Area, Tooltip, Brush } from 'recharts';
import { statsOfContactRequests } from '@data/Stats';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import LoadingOverlay from '@components/common/LoadingOverlay';
import { Strings, translateResponseMessage, translateRequestError, httpRejectedError } from '@i18n';


const Container = styled.div``;

export default function ContactRequestsStats() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(-1);


  useEffect(() => {
    setLoading(true);

    statsOfContactRequests().then(async resp => {
      if (resp.ok) {
        const { data, total } = await resp.json();

        setData(data);
        setTotal(total);
      } else {
        toast.warning(translateResponseMessage(resp));
      }
    }).catch(err => {
      toast.error(translateRequestError(err));
    }).finally(() => {
      setLoading(false);
    });
  }, []);
 

  function renderChart() {
    return (
      <>
        <ResponsiveContainer className="line-chart-wrapper" width="100%" height={400}>
          <LineChart
            // width={600}
            data={data}
            margin={{ top: 40, right: 40, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={['auto', 'auto']}
              label={{
                value: 'Requests sent per day',
                angle: -90,
                offset: 0,
                position: { x: 0, y: '20%' }
              }} />
            <Tooltip
              wrapperStyle={{
                borderColor: 'white',
                boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)',
              }}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              labelStyle={{ fontWeight: 'bold', color: '#666666' }}
              formatter={(value) => [value, 'Sent']}
            />
            <Line dataKey="count" stroke="#82ca9d" type="monotone" dot={true} />
            <Brush dataKey="date" startIndex={0}>
              <AreaChart>
                <CartesianGrid />
                <YAxis hide domain={['auto', 'auto']} />
                <Area dataKey="count" stroke="#82ca9d" fill="#82ca9d" dot={false} />
              </AreaChart>
            </Brush>
          </LineChart>
        </ResponsiveContainer>
        <p>Total requests sent: {total}</p>
      </>
    );
  }

  return (
    <Container>
      <h3>Contact Requests Statistics</h3>
      <hr/>
      {loading ? <LoadingOverlay/> : renderChart()}
    </Container>
  );
}
