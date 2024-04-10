/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState } from "react";
import Layouts from "../../layout/Users";
import backs from "../../assets/holding-tomotoes.jpg";
import { Row, Col, Spin, Modal, Input, Form, Button, Avatar } from "antd";
import {
  useAddCommodity,
  useAddMarketnewsComment,
  useGetAllNews,
  useGetAllNewsComment,
} from "../Admin/hooks";
import { decode } from "html-entities";
import { Image } from "antd";
import { Iconify } from "../../components/icon";
import { clipBoard } from "../../utils";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { useIsMutating } from "@tanstack/react-query";
import { useGetMe } from "../../hooks/auth";
import { UserOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context";

interface NewsItem {
  description: string;
  title: string;
  image: string;
  updatedAt: string;
  id: number;
  _id: number;
}

interface FormData {
  comments: string;
  marketNewsId: string;
}

const MarketNews = () => {
  const data = useGetMe();
  const location = useLocation();

  const { user } = useContext(AuthContext);

  const isLoading = useIsMutating();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FormData>({
    marketNewsId: "",
    comments: "",
  });

  const { data: allNews } = useGetAllNews();
  const [open, setOpen] = useState(false);
  const [previewNews, setPreviewNews] = React.useState<NewsItem | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [likeColor, setLikeColor] = useState("black");
  const [dislikeColor, setDislikeColor] = useState("black");
  const [userChoice, setUserChoice] = useState("");
  const [selectedNewsId, setSelectedNewsId] = React.useState<number | null>(
    null
  );

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const latestNews = React.useMemo(() => {
    return allNews
      ? allNews.filter((news: { updatedAt: string | number | Date }) => {
          const newsDate = new Date(news.updatedAt);
          return newsDate > twoDaysAgo;
        })
      : [];
  }, [allNews]);

  const olderNews = React.useMemo(() => {
    return allNews
      ? allNews.filter((news: { updatedAt: string | number | Date }) => {
          const newsDate = new Date(news.updatedAt);
          return newsDate <= twoDaysAgo;
        })
      : [];
  }, [allNews]);

  React.useEffect(() => {
    if (olderNews && olderNews.length > 0) {
      setPreviewNews(olderNews[0]);
    }
  }, [olderNews]);

  const { mutate } = useAddMarketnewsComment();
  const { data: comment } = useGetAllNewsComment(selectedNewsId);

  React.useEffect(() => {
    if (selectedNewsId !== null) {
      const selected = [...olderNews, ...latestNews]?.find(
        (selected: { _id: any }) => selected._id === selectedNewsId
      );
      setPreviewNews(selected);
    }
  }, [selectedNewsId, olderNews, latestNews]);

  React.useEffect(() => {
    const selectedNewsIdFromUrl = new URLSearchParams(location.search).get(
      "newsId"
    );
    if (selectedNewsIdFromUrl) {
      const selected = [...olderNews, ...latestNews]?.find(
        (selected: { _id: any }) => selected._id === selectedNewsIdFromUrl
      );
      setPreviewNews(selected);
    }
  }, [location.search, olderNews, latestNews]);

  // const selectedNewsComments = comments?.filter(
  //   (cmt: { marketNewsId: number | null }) =>
  //     cmt.marketNewsId === selectedNewsId
  // );

  let url = window.location.href;

  const handleNews = (news: NewsItem) => {
    setSelectedNewsId(news._id);
    setPreviewNews(news);
    window.history.replaceState(
      null,
      "",
      `/user/market-news?newsId=${news._id}`
    );
    url = window.location.href;
  };

  const handleLike = () => {
    if (userChoice === "dislike") {
      return;
    }
    setLikes(likes + 1);
    setLikeColor("#658127");
    setUserChoice("like");
  };

  // Handle click on the dislike button
  const handleDislike = () => {
    if (userChoice === "like") {
      return;
    }
    setDislikes(dislikes + 1);
    setDislikeColor("red");
    setUserChoice("dislike");
  };

  // Handle click on the like button to remove like
  const removeLike = () => {
    if (userChoice === "like") {
      setLikes(likes - 1);
      setLikeColor("black");
      setUserChoice("");
    }
  };

  // Handle click on the dislike button to remove dislike
  const removeDislike = () => {
    if (userChoice === "dislike") {
      setDislikes(dislikes - 1);
      setDislikeColor("black");
      setUserChoice("");
    }
  };

  React.useEffect(() => {
    const selectedNews = allNews?.find(
      (news: { _id: number | null }) => news._id === selectedNewsId
    );
    if (selectedNews) {
      setLikes(selectedNews.likes);
      setDislikes(selectedNews.dislikes);
    }
  }, [selectedNewsId, allNews]);

  React.useEffect(() => {
    // Reset color and user choice
    setLikeColor("black");
    setDislikeColor("black");
    setUserChoice("");

    if (selectedNewsId !== null) {
      const selectedNewsComments = comment?.filter(
        (coms: { marketNewsId: number | null }) =>
          coms?.marketNewsId === selectedNewsId
      );

      if (selectedNewsComments) {
        form.resetFields();
        setDislikes(
          selectedNewsComments.reduce(
            (acc: number, curr: { dislike: any }) => acc + Number(curr.dislike),
            0
          )
        );
        setLikes(
          selectedNewsComments.reduce(
            (acc: number, curr: { like: any }) => acc + Number(curr.like),
            0
          )
        );
        setComments(selectedNewsComments);

        // Set color based on user's like or dislike
        const userComment = selectedNewsComments.find(
          (coms: { user: { _id: string } }) => coms.user._id === user?._id
        );
        if (userComment) {
          if (userComment.like) {
            setLikeColor("#658127");
            setUserChoice("like");
          } else if (userComment.dislike) {
            setDislikeColor("red");
            setUserChoice("dislike");
          }
        }
      }
    }
  }, [selectedNewsId, comment, user?._id]);

  const handleShare = () => {
    setOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      clipBoard("Link copied to clipboard!");
    } catch (err) {
      clipBoard("Failed to copy link!");
    }
  };

  const decodedHtml = decode(previewNews?.description || "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const Data = new FormData();
      Data.append(
        "marketNewsId",
        selectedNewsId ? selectedNewsId.toString() : ""
      );
      Data.append("comments", formData?.comments);
      Data.append("like", (likes > 0).toString());
      Data.append("dislike", (dislikes > 0).toString());

      mutate(Data as any, {
        onSuccess: () => {
          form.resetFields();
        },
      });
    } catch (error) {}
  };

  return (
    <Layouts Heading="Market News" Background={backs}>
      <div className="mt-0 w-full sm:w-full">
        <Row gutter={12} className="gap-2 sm:gap-0">
          <Col xs={24} sm={24} md={6} lg={6}>
            <div
              style={{
                fontSize: "15px",
                letterSpacing: ".8px",
                color: "white",
                marginBottom: "1rem",
                paddingLeft: "2rem",
                background: "#658127",
                width: "100%",
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              Recent News
            </div>
            {latestNews?.map((news: any, index: any) => (
              <div
                key={news?._id}
                onClick={() => handleNews(news)}
                style={{
                  paddingLeft: "2rem",
                  cursor: "pointer",
                  padding: "10px",
                  background:
                    previewNews?._id === news._id ? "#d0d0d0" : "#f0f0f0",
                }}
              >
                {news.title}
              </div>
            ))}

            <>
              <div
                style={{
                  fontSize: "15px",
                  letterSpacing: ".8px",
                  color: "white",
                  marginBottom: "1rem",
                  marginTop: "3rem",
                  paddingLeft: "2rem",
                  background: "#658127",
                  width: "100%",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Older News
              </div>
              {olderNews?.map((news: any, index: any) => (
                <div
                  key={news?._id}
                  onClick={() => handleNews(news)}
                  style={{
                    paddingLeft: "2rem",
                    cursor: "pointer",
                    padding: "10px",
                    background:
                      previewNews?._id === news._id ? "#d0d0d0" : "#f0f0f0",
                  }}
                >
                  {news.title}
                </div>
              ))}
            </>
          </Col>

          <Col xs={24} sm={24} md={18} lg={18}>
            <div className="pt-4 sm:pt-0">
              <div style={{ position: "relative" }}>
                <Image
                  width="100%"
                  height="30%"
                  preview={false}
                  src={
                    Array.isArray(previewNews?.image)
                      ? previewNews?.image[0]
                      : previewNews?.image || ""
                  }
                  fallback="https://via.placeholder.com/120"
                  placeholder={
                    <div
                      style={{
                        width: "100%",
                        height: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Spin size="large" />
                    </div>
                  }
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: -25,
                    left: 0,
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    paddingTop: "5px",
                    paddingLeft: "15px",
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="w-full text-sm justify-center sm:text-md mb-10 font-bold"
                >
                  {previewNews?.title}
                </div>
              </div>

              <div
                className="w-full ml-2 text-sm sm:text-md mb-5"
                style={{ marginTop: "1rem" }}
                dangerouslySetInnerHTML={{ __html: decodedHtml || "" }}
              />
            </div>

            <div className="flex justify-between items-left mb-4">
              <div>
                <button
                  className="mr-4"
                  onClick={userChoice === "like" ? removeLike : handleLike}
                  style={{ color: likeColor }}
                >
                  <Iconify size={18} icon="heroicons:hand-thumb-up-solid" />
                  <span className="text-sm ml-2">{likes || 0}</span>{" "}
                </button>
                <button
                  className="mr-6"
                  onClick={
                    userChoice === "dislike" ? removeDislike : handleDislike
                  }
                  style={{ color: dislikeColor }}
                >
                  <Iconify size={18} icon="heroicons:hand-thumb-down-solid" />
                  <span className="text-sm ml-2">{dislikes || 0}</span>{" "}
                </button>

                <button className="text-sm" onClick={handleShare}>
                  <Iconify size={18} icon="ri:share-fill" />
                </button>
              </div>
            </div>

            <div className="mt-10 mb-2 font-bold text-xl">
              Comments ({comments?.length || 0})
            </div>
            <hr className="w-full mb-4" />

            <div className="flex w-full gap-2">
              <div className="w-[10%] md:w-[5%] mt-4 items-center mr-3 md:mr-3">
                <Avatar icon={<UserOutlined />} size={40} src={data?.photo} />
              </div>

              <div className="w-[90%] md:w-[95%] mt-4">
                <Form
                  form={form}
                  variant="borderless"
                  layout="vertical"
                  size="large"
                  requiredMark={false}
                  name="comments-form"
                  className="flex-col sm:flex-row md:w-full sm:w-full"
                >
                  <Form.Item
                    name="comments"
                    rules={[{ required: true, message: "Input a comment" }]}
                  >
                    <TextArea
                      name="comments"
                      onChange={handleInputChange}
                      className="border-gray-300 rounded-none"
                      placeholder="Add a comment..."
                      rows={3}
                      style={{ backgroundColor: "#EBE9E9" }}
                    />
                  </Form.Item>

                  <div className="flex justify-end py-1">
                    <Button
                      name="submit"
                      type="primary"
                      htmlType="submit"
                      onClick={handleSubmit}
                      className="w-30 h-10 ml-6 rounded bg-blue-500 hover:text-black hover:bg-white text-sm"
                      style={{
                        background:
                          "linear-gradient(89.46deg, #39462D 13.05%, #658127 107.23%)",
                        color: "white",
                      }}
                      loading={isLoading > 0}
                    >
                      Submit{" "}
                    </Button>
                  </div>
                </Form>
              </div>
            </div>

            <div className="comments-section"></div>
            <div className="comments">
              {Array.isArray(comments) && comments.length > 0 ? (
                comments.map((c: any, index: any) => (
                  // <p key={index}>{comment}</p>
                  <div key={index} className="flex w-full gap-2 ">
                    <div className="w-[10%] md:w-[5%] mt-4 items-center mr-3 md:mr-3">
                      <Avatar
                        icon={<UserOutlined />}
                        size={40}
                        src={c?.user?.photo}
                      />
                    </div>

                    <div className="w-[90%] md:w-[95%] mt-7 flex flex-col">
                      <div className="font-bold text-md">
                        {c?.user?.fullname}
                      </div>
                      <div className="text-sm mt-2">{c?.comments}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Comment Yet</p>
              )}
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title=""
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={500}
        footer={null}
      >
        <div className="mt-15">
          <div className="mb-5 text-2xl font-bold">Share News on:</div>
          <div className="flex flex-row justify-between items-center">
            <Input
              className="border-gray-300 rounded-none h-10"
              value={url}
              readOnly
              style={{ backgroundColor: "#EBE9E9" }}
            />

            <button className="text-sm ml-8" onClick={handleCopy}>
              <Iconify size={28} icon="ph:clipboard-light" />
            </button>
          </div>

          <div className="mt-10 mb-10">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-5"
            >
              <Iconify size={28} icon="mingcute:facebook-fill" />
            </a>
            <a
              href={`https://twitter.com/share?url=${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-5"
            >
              <Iconify size={28} icon="line-md:twitter-x" />
            </a>

            <a
              href={`https://wa.me/?text=${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-5"
            >
              <Iconify size={28} icon="mingcute:whatsapp-fill" />
            </a>

            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Iconify size={28} icon="mdi:linkedin" />
            </a>
          </div>
        </div>
      </Modal>
    </Layouts>
  );
};

export default MarketNews;
