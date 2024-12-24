import React, {useState} from 'react';
import {Button, Flex, Form, Input, message, Modal, notification, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import useSWR from "swr";
import {api_genre} from "./api";
import {afterRequest, getRequest, postRequest, triggerAxios} from "./config";
import useSWRMutation from "swr/mutation";

const Genre = () => {

    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const {data = [], isLoading, mutate} = useSWR({url: api_genre}, getRequest)

    const {trigger, isMutating} = useSWRMutation(api_genre, postRequest)
    const {trigger: deleteTrigger, isMutating: deleteIsMutating} = useSWRMutation(api_genre, triggerAxios)

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Action",
            render: (record) => <Space>
                <Button onClick={() => {
                    form.setFieldsValue(record)
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
        afterRequest(trigger, {data: values}, () => {
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
                <h1>Genre</h1>
                <Button icon={<PlusOutlined/>} type={"primary"} onClick={() => setOpen(true)}>Add Genre</Button>
            </Flex>

            <Modal open={open} title={"Genre"}
                   onCancel={handleClose}
                   footer={false}
                   afterClose={() => {
                       form.resetFields()
                   }}
            >
                <Form form={form} onFinish={onFinish} layout={"vertical"}>
                    <Form.Item name={"id"} label={"ID"} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={"type"} label={"Type"} rules={[
                        {required: true, message: "Type is required"}
                    ]}>
                        <Input/>
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

export default Genre;