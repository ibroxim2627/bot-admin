import React, {useState} from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom"
import {Button, Layout, Menu, notification, theme} from "antd";
import {SWRConfig} from "swr"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";
import Home from "./Home";
import Genre from "./Genre";
import Movie from "./Movie";

const {Header, Sider, Content} = Layout;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    return (
        <SWRConfig value={{
            dedupingInterval: 10000, errorRetryCount: 6, errorRetryInterval: 10000, onError: (error, key) => {
                console.log(error)
                notification?.open({
                    pauseOnHover: true,
                    message: error?.response?.data?.message || error?.response?.data?.error || error?.message,
                    key: 'updatable',
                    type: 'error',
                })
            }
        }}>
            <Router>
                <Layout style={{height: "100vh"}}>
                    <Sider trigger={null} theme={"light"} collapsible collapsed={collapsed}>
                        <div className="demo-logo-vertical"/>
                        <Menu
                            theme="light"
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            items={[
                                {
                                    key: '1',
                                    icon: <UserOutlined/>,
                                    label: <Link to={"/"}>Home</Link>,
                                },
                                {
                                    key: '2',
                                    icon: <VideoCameraOutlined/>,
                                    label: <Link to={"/genre"}>Genre</Link>,
                                    // children: [
                                    //     {key: "6", icon: <UserOutlined />, label: "nav 6"},
                                    // ]
                                },
                                {
                                    key: '3',
                                    icon: <UploadOutlined/>,
                                    label: <Link to={"/movie"}>Movie</Link>,
                                },
                            ]}
                        />
                    </Sider>
                    <Layout style={{height: "100vh"}}>
                        <Header
                            style={{
                                padding: 0,
                                background: colorBgContainer,
                            }}
                        >
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                                overflowY: "auto"
                            }}
                        >
                            <Routes>
                                <Route path={"/"} element={<Home/>}/>
                                <Route path={"/genre"} element={<Genre/>}/>
                                <Route path={"/movie"} element={<Movie/>}/>
                            </Routes>
                        </Content>
                    </Layout>
                </Layout>
            </Router>
        </SWRConfig>
    );
};

export default App;