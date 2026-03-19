from github import Github
import base64

# --- 配置区 ---
ACCESS_TOKEN = "你的GitHub_Token" # 贴入你刚才申请的Token
REPO_NAME = "liulian1234/findplace" # 你的仓库名
BRANCH = "main"

# --- 任务内容 ---
task_id = "f99v"
description = "这是一种罕见的紫色螺旋状草本，具有极高的药用价值。"
price = "1500 MYR"
image_path = "f9v.jpg" # 确保你本地有这张图

def upload_to_github():
    g = Github(ACCESS_TOKEN)
    repo = g.get_repo(REPO_NAME)

    # 1. 准备 JSON 数据
    content = f'''{{
        "id": "{task_id}",
        "desc": "{description}",
        "img": "/images/{image_path}",
        "price": "{price}"
    }}'''

    # 2. 上传 JSON 文件到 tasks 文件夹
    path_json = f"tasks/{task_id}.json"
    try:
        repo.create_file(path_json, f"Add task {task_id}", content, branch=BRANCH)
        print(f"✅ JSON 已上传到 {path_json}")
    except:
        print(f"⚠️ {path_json} 已存在，正在更新...")
        file = repo.get_contents(path_json, ref=BRANCH)
        repo.update_file(path_json, f"Update task {task_id}", content, file.sha, branch=BRANCH)

    # 3. 上传图片到 images 文件夹
    path_img = f"images/{image_path}"
    with open(image_path, "rb") as f:
        img_data = f.read()
    
    try:
        repo.create_file(path_img, f"Add image {image_path}", img_data, branch=BRANCH)
        print(f"✅ 图片已上传到 {path_img}")
    except:
        print(f"ℹ️ 图片 {path_img} 已存在，跳过上传。")

if __name__ == "__main__":
    upload_to_github()
    print("\n🚀 发布完成！请等待 1 分钟后刷新网页。")
