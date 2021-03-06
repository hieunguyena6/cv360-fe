import { useRef, useState } from 'react'
import styles from '../../styles/Home.module.css'
import { Button, message, Modal, Image, Tabs, Table } from 'antd';
import Webcam from "react-webcam";
import { checkCrime } from '../../utils/api-services/crime-service'

const { TabPane } = Tabs;

export default function Home() {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const columns_result = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%'
    },
    {
      title: 'Percent',
      dataIndex: 'percent',
      key: 'percent',
      width: '10%',
      render: (text) => {
        return `${text * 100}%`
      }
    },
    {
      title: 'Real Face',
      dataIndex: 'real_face',
      key: 'real_face',
      width: '35%',
      align: "center",
      render: (text) => {
        return <Image src={text} />
      }
    },
    {
      title: "Crime's face ",
      dataIndex: 'face_image',
      key: 'face_image',
      width: '35%',
      align: "center",
      render: (text) => {
        return <Image src={text} />
      }
    }
  ];

  const capturePicture = async () => {
    try {
      setLoading(true)
      const response = await checkCrime({ real_image: webcamRef.current.getScreenshot() })
      if (response.success) {
        const list_crime = response.data
        if (list_crime.length > 0) {
          const crime = list_crime[0]
          const [, ...other_crimes] = list_crime
          Modal.warning({
            content: (
              <Tabs defaultActiveKey="best_result" >
                <TabPane tab="Most similarity" key="best_result">
                  <div>
                    <p>Name: {crime.name}</p>
                    <p>Percent: {crime.percent * 100}%</p>
                    <p>Real face: <Image src={crime.real_face} width={200} height={200} style={{ margin: '12px 32px' }} /></p>
                    <p>Crime Face: <Image src={crime.face_image} width={200} height={200} style={{ margin: '12px 32px' }} /></p>
                  </div>
                </TabPane>
                <TabPane tab="Other result">
                  <Table dataSource={other_crimes} columns={columns_result} pagination={false} />
                </TabPane>
              </Tabs>
            ),
            onOk() { },
            width: 640,
            style: { top: 20 },
          });
        } else {
          message.success("Success !!")
        }
      } else {
        message.error(response.message)
      }
      setLoading(false)
    } catch (error) {
      throw error
    }
  }

  return (
    <div className={styles.container}>
      <Webcam
        audio={false}
        ref={webcamRef}
      />
      {/* <Button
        type="primary"
        style={{ margin: 16 }}
        size="large"
        onClick={capturePicture}
        loading={loading}
      >Capture</Button> */}
    </div>
  )
}
