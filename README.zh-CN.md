# SubmitRank 开放目录

这是一个由社区共同维护的公开目录，收录可以提交和发布产品、工具、公司及作品的网站。

原始数据通过 GitHub Pull Request 维护。[SubmitRank](https://submitrank.com/) 是初始整理者，并在独立的网站产品中提供评级、筛选、提交管理等增强功能。

## 数据在哪里

- [`sites/`](sites/)：可人工编辑的 YAML 源数据，每个域名一个文件
- [`dist/sites.json`](dist/sites.json)：自动生成的 JSON
- [`dist/sites.csv`](dist/sites.csv)：自动生成的 CSV
- [`dist/stats.json`](dist/stats.json)：自动生成的统计数据
- [`schema/site.schema.json`](schema/site.schema.json)：数据 Schema

`sites/` 是唯一的数据源，`dist/` 中的文件不能直接编辑。

## 如何贡献

你可以提交新网站、修正已有信息，或者报告已经关闭、失效的投稿入口。普通用户可以使用仓库的 Issue 表单，熟悉 GitHub 的用户可以直接修改 `sites/` 下的 YAML 并提交 PR。

新网站必须真实允许第三方提交产品、作品或公司，并提供公开可核验的来源。允许站长自荐，但需要披露与网站的关系。完整规则请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 与 SubmitRank.com 的关系

这个仓库只维护公开目录事实，不包含私有备注、用户数据、第三方流量指标、评级、内部审核数据、密钥或部署配置。

合并到本仓库的贡献不会通过程序自动回填 SubmitRank.com 或其生产数据库。因此网站与开源数据集之间可能存在差异。详细说明见 [DATA_POLICY.md](DATA_POLICY.md)。

## 本地校验

需要 Node.js 20 或更新版本：

```bash
npm install
npm run validate
npm test
npm run build
npm run check
```

数据采用 [CC BY 4.0](LICENSE)；校验脚本、Schema、测试及工作流采用 [MIT License](LICENSE-CODE)。
