import {
  User,
  Community,
  ProblemType,
  EnvironmentProblem,
} from "../types/index";

// 模拟用户数据
export const mockUsers: User[] = [
  {
    user_id: "90be1722bde24ca0a4d7082ef8e84b2b",
    phone: "15294945765",
    openid: "wx_12b3aeed4c694fc7",
    nickname: "费鹏",
    avatar: "https://dummyimage.com/200x200",
    role: 1, // 管理员
    community_id: "b7a6a549737044838361693fd65013db",
    created_at: "2025-06-24 07:17:20",
  },
  {
    user_id: "0871d2edb97b4c05acf37fe564a4d568",
    phone: "13142947612",
    nickname: "施玉兰",
    avatar: "https://dummyimage.com/200x200",
    role: 0, // 普通用户
    community_id: "b7a6a549737044838361693fd65013db",
    created_at: "2025-02-07 18:44:05",
  },
  {
    user_id: "b6d934358f3f4f9690db820162a10a4b",
    phone: "15922968956",
    nickname: "李畅",
    avatar: "https://placekitten.com/200/200",
    role: 0,
    community_id: "53466a24e08448128f3e87078784bc9c",
    created_at: "2025-07-18 20:09:23",
  },
];

// 模拟社区数据
export const mockCommunities: Community[] = [
  {
    community_id: "b7a6a549737044838361693fd65013db",
    community_text: "阳光小区",
  },
  {
    community_id: "01aecc93992940f888a86926932f8b06",
    community_text: "星辰公寓",
  },
  {
    community_id: "095aa7baa90a4d489d5da271e5fb7bc7",
    community_text: "金色港湾",
  },
  {
    community_id: "19524b1f05864625bbad347adb9f2eef",
    community_text: "幸福家园",
  },
  {
    community_id: "53466a24e08448128f3e87078784bc9c",
    community_text: "梧桐苑",
  },
];

// 模拟问题类型数据
export const mockProblemTypes: ProblemType[] = [
  {
    type_id: "eba803f7de074eca8da3ee01d61b1850",
    type_text: "环境卫生",
  },
  {
    type_id: "de2118708c5e44409124014f86fb6d3a",
    type_text: "公共设施",
  },
  {
    type_id: "8262ae3896854e118853fc184d3f7e17",
    type_text: "消防安全",
  },
  {
    type_id: "777308d8be184f05be939b1823157646",
    type_text: "违章搭建",
  },
  {
    type_id: "19927d6f3436440cb55ad34c53705ddd",
    type_text: "绿化养护",
  },
  {
    type_id: "27049215c12c4d7592eedfc4d0d3835c",
    type_text: "交通秩序",
  },
  {
    type_id: "272930f90dd14988a9add0a80a03e695",
    type_text: "噪音扰民",
  },
  {
    type_id: "73b88f3dfca24f9db9d31a93cf61c204",
    type_text: "其他问题",
  },
];

// 模拟环境问题数据
export const mockProblems: EnvironmentProblem[] = [
  {
    problem_id: "25bdba8b635e42da9f3cd902af169b9b",
    user_id: "0871d2edb97b4c05acf37fe564a4d568",
    community_id: "b7a6a549737044838361693fd65013db",
    type_id: "777308d8be184f05be939b1823157646",
    title: "电梯故障",
    location: "中心花园",
    image_path: "uploads/b0da2a3e406c.jpg",
    status: 0, // 未整改
    created_at: "2025-09-29 17:49:29",
  },
  {
    problem_id: "4b1f8ebdc5c84a9f9ec505db06bdff87",
    user_id: "0871d2edb97b4c05acf37fe564a4d568",
    community_id: "b7a6a549737044838361693fd65013db",
    type_id: "8262ae3896854e118853fc184d3f7e17",
    title: "电动车违规充电",
    location: "物业办公室旁",
    image_path: "uploads/6fafbc5c02eb.jpg",
    status: 0,
    created_at: "2025-09-29 17:47:26",
  },
  {
    problem_id: "5d5f69609cb34ac982c13862ed366afe",
    user_id: "0871d2edb97b4c05acf37fe564a4d568",
    community_id: "b7a6a549737044838361693fd65013db",
    type_id: "777308d8be184f05be939b1823157646",
    title: "路灯不亮",
    location: "1号楼1单元",
    image_path: "uploads/a861b2cb6ace.jpg",
    status: 0,
    created_at: "2025-09-29 17:48:10",
  },
  {
    problem_id: "cf649bf6240a463b99945157a5e20fe4",
    user_id: "90be1722bde24ca0a4d7082ef8e84b2b",
    community_id: "b7a6a549737044838361693fd65013db",
    type_id: "de2118708c5e44409124014f86fb6d3a",
    title: "电动车违规充电",
    location: "2号楼B座",
    image_path: "uploads/c7dcb22f940b.jpg",
    resolved_image_path: "uploads/2bf613b3dfe8.jpg",
    status: 1, // 已整改
    resolved_by: "3389cfb1303d41dda1fadb632b9977e1",
    resolved_at: "2025-09-29 17:50:15",
    created_at: "2025-09-29 17:48:20",
  },
  {
    problem_id: "2b495a7e741e41b0baa50aa0d8e61c3f",
    user_id: "b33867aad7ec490ea323bc66011ebdcd",
    community_id: "b5ed6c2b4e1d42638c4a57084a12f240",
    type_id: "8262ae3896854e118853fc184d3f7e17",
    title: "积水严重",
    location: "垃圾站周边",
    image_path: "uploads/622c14dd4896.jpg",
    status: 0,
    created_at: "2025-09-29 17:49:59",
  },
];
