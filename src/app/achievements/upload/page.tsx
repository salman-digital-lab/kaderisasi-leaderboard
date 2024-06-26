"use client";
import { Footer, Navabar } from "@/components/layout";
import { createAchievement } from "@/db/queries/achievements";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  GetProp,
  Input,
  Layout,
  Modal,
  Select,
  Space,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Content } = Layout;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function AchievementUpload() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const router = useRouter();

  const { Title, Text } = Typography;

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const normFile = (e: any) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const [form] = Form.useForm();
  const onSubmit = (): void => {
    console.log(form.getFieldsValue());
    createAchievement(form.getFieldsValue());
  };

  return (
    <>
      <Button
        size="large"
        onClick={() => router.back()}
        icon={<LeftOutlined />}
      />
      <Flex align="center" style={{ marginBottom: "50px" }} vertical>
        <Title level={1} style={{ color: "#1D566D" }}>
          Form Pencapaian
        </Title>
        <Text style={{ color: "#1D566D", fontSize: "18px" }}>
          Isi form berikut dengan benar. Lalu, upload bukti, submit, dan tunggu
          persetujuan admin.
        </Text>
      </Flex>
      <Flex justify="center">
        <Form
          form={form}
          layout="vertical"
          style={{ backgroundColor: "#ffffff", padding: "26px", width: "50vw" }}
          onSubmitCapture={onSubmit}
        >
          <Form.Item
            label="Pencapaian"
            name="pencapaian"
            rules={[{ required: true }]}
          >
            <Input size="large" placeholder="Masukan Pencapaian" />
          </Form.Item>
          <Flex gap={20}>
            <Form.Item
              label="Aktivitas"
              name="aktivitas"
              style={{ width: "100%" }}
              rules={[{ required: true }]}
            >
              <Select
                placeholder="--Pilih Aktivitas--"
                options={[
                  { value: "academic", label: "Academic" },
                  { value: "competition", label: "Competition" },
                  { value: "organization", label: "Organization" },
                ]}
                size="large"
              />
            </Form.Item>
            <Form.Item
              label="Skala Pencapaian"
              style={{ width: "100%" }}
              name="skala"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="--Pilih Skala--"
                options={[
                  { value: "1", label: "1" },
                  { value: "2", label: "2" },
                  { value: "3", label: "3" },
                ]}
                size="large"
              />
            </Form.Item>
          </Flex>
          <Form.Item
            label="Tanggal"
            name="tanggal"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} size="large" />
          </Form.Item>
          <Space direction="vertical">
            <Text>Upload Bukti Pencapaian</Text>
            <Space direction="vertical">
              <Form.Item
                name="upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <Image
                  src={previewImage}
                  width={300}
                  height={400}
                  layout="responsive"
                  alt="example"
                />
              </Modal>
            </Space>
            <Text type="warning">*Cukup upload 1 gambar</Text>
            <Text type="warning">*Ukuran file maksimal 10 MB</Text>
            <Text type="warning">*Ekstensi jpg,png,jpeg</Text>
          </Space>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: "100%", marginTop: 20 }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  );
}
