import React, {useState} from 'react';
import {Button, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Upload, Image} from "antd";
import useSWR from "swr";
import {api_genre, api_movie} from "./api";
import {afterRequest, getRequest, postRequest, triggerAxios} from "./config";
import useSWRMutation from "swr/mutation";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import ImgCrop from 'antd-img-crop';

const Movie = () => {

    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([]);
    const {data: dataGenre = []} = useSWR({url: api_genre}, getRequest)

    const {data = [], isLoading, mutate} = useSWR({url: api_movie}, getRequest)

    const {trigger, isMutating} = useSWRMutation(api_movie, postRequest)
    const {trigger: deleteTrigger, isMutating: deleteIsMutating} = useSWRMutation(api_movie, triggerAxios)

    const onChange = ({fileList: newFileList}) => {
        setFileList(newFileList);
        form.setFieldValue("img", newFileList)
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Genre",
            dataIndex: "genre_name",
            key: "genre_name",
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "url",
            dataIndex: "url",
            key: "url",
        },
        {
            title: "img_url",
            dataIndex: "img_url",
            key: "img_url",
            render: (text) =>  <Image
                fallback="data:image/png;base64,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"
                width={100}
                src={`http://localhost:5000/img/${text}`}
            />
        },
        {
            title: "Action",
            render: (record) => <Space>
                <Button onClick={() => {
                    form.setFieldsValue(record)
                    let img = [{
                        uid: '-1',
                        status: 'done',
                        url: `http://localhost:5000/img/${record.img_url}`
                    }]
                    form.setFieldValue("img", img)
                    setFileList(img)
                    setOpen(true)
                }} type={"primary"} ghost icon={<EditOutlined/>}/>
                <Popconfirm title={"Are you sure ?"} onConfirm={() => deleteAction(record.id)}>
                    <Button danger icon={<DeleteOutlined/>}/>
                </Popconfirm>
            </Space>
        }
    ]

    const handleClose = () => {
        setOpen(false);
    }

    const onFinish = (values) => {
        const formData = new FormData();
        console.log(values)
        if (values.id) formData.append("id", values.id)
        formData.append("name", values.name)
        formData.append("genre_id", values.genre_id)
        formData.append("code", values.code)
        formData.append("description", values.description)
        formData.append("url", values.url)
        formData.append("img", values.img[0]?.originFileObj)
        afterRequest(trigger, {data: formData}, () => {
            message.success("Successfully").then()
            setOpen(false)
            mutate().then()
        })
    }

    const deleteAction = (id) => {
        afterRequest(deleteTrigger, {
            method: "DELETE",
            params: {id}
        }, () => {
            message.success("Successfully").then()
            mutate().then()
        })
    }

    return (
        <div>
            <Flex justify={"space-between"} align={"center"}>
                <h1>Movie</h1>
                <Button icon={<PlusOutlined/>} type={"primary"} onClick={() => setOpen(true)}>Add Genre</Button>
            </Flex>

            <Modal open={open} title={"Movie"}
                   onCancel={handleClose}
                   footer={false}
                   afterClose={() => {
                       setFileList([])
                       form.resetFields()
                   }}
            >
                <Form form={form} onFinish={onFinish} layout={"vertical"}>
                    <Form.Item name={"id"} label={"ID"} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={"name"} label={"Name"} rules={[
                        {required: true, message: "Name is required"}
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={"code"} label={"Code"} rules={[
                        {required: true, message: "Code is required"}
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={"genre_id"} label={"Genre"} rules={[
                        {required: true, message: "Genre is required"}
                    ]}>
                        <Select

                            showSearch
                            filterOption={(input, option) =>
                                option.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={dataGenre.map(item => ({label: item.type, value: item.id}))}
                        />
                    </Form.Item>
                    <Form.Item name={"description"} label={"Description"}>
                        <TextArea/>
                    </Form.Item>
                    <Form.Item name={"url"} label={"URL"} rules={[
                        {required: true, message: "URL is required"}
                    ]}>
                        <Input/>
                    </Form.Item>

                    {/*IMAGE upload file*/}
                    <Form.Item name={"img"} label={"Image"}
                               valuePropName={"fileList"}
                               rules={[{
                                   required: true,
                                   message: "Image is required",
                                   validator: (rule, value) => {
                                        if (value.length === 0 || value[0].status === "error") {
                                             return Promise.reject("Image is required")
                                        }
                                        return Promise.resolve()
                                   }
                               }]}
                               trigger={"onChange"}>
                        <ImgCrop rotationSlider>
                            <Upload
                                maxCount={1}
                                beforeUpload={(file) => {
                                    if (file.type !== "image/jpeg" && file.type !== "image/png") {
                                        message.error(`${file.name} is not a jpg or png file`);
                                        return true;
                                    }
                                    return false
                                }}
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                            >
                                {fileList.length < 1 && '+ Upload'}
                            </Upload>
                        </ImgCrop>
                    </Form.Item>
                    <Flex justify={"end"} align={"center"}>
                        <Space>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button htmlType={"submit"} type={"primary"} loading={isMutating}>Save</Button>
                        </Space>
                    </Flex>
                </Form>
            </Modal>
            <Table
                bordered
                columns={columns}
                rowKey={"id"}
                loading={isLoading || deleteIsMutating}
                dataSource={data}
            />
        </div>
    );
};

export default Movie;