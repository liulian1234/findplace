import tkinter as tk
from tkinter import filedialog, messagebox
from github import Github
import os

# ================= 配置区 =================
TOKEN = "你的ghp_开头的Token"
REPO_NAME = "liulian1234/findplace"
# ==========================================

class VoyagerPublisher:
    def __init__(self, root):
        self.root = root
        self.root.title("伏尼契馆长发布器 V2.0")
        self.root.geometry("420x550")
        self.root.configure(bg="#f5e6c8")

        tk.Label(root, text="🏺 任务同步系统", font=("Arial", 18, "bold"), bg="#f5e6c8", fg="#5d4037").pack(pady=20)

        # 编号输入
        tk.Label(root, text="任务编号 (例如: f105v)", bg="#f5e6c8").pack()
        self.entry_id = tk.Entry(root, width=35)
        self.entry_id.pack(pady=5)

        # 描述输入
        tk.Label(root, text="特征描述:", bg="#f5e6c8").pack()
        self.text_desc = tk.Text(root, width=35, height=5)
        self.text_desc.pack(pady=5)

        # 赏金输入
        tk.Label(root, text="赏金金额 (MYR):", bg="#f5e6c8").pack()
        self.entry_price = tk.Entry(root, width=35)
        self.entry_price.pack(pady=5)

        # 图片选择
        self.btn_img = tk.Button(root, text="📸 选择植物图片", command=self.select_file)
        self.btn_img.pack(pady=10)
        self.lbl_path = tk.Label(root, text="未选图", bg="#f5e6c8", fg="gray")
        self.lbl_path.pack()

        # 发布按钮
        self.btn_pub = tk.Button(root, text="🚀 同步到猎人大厅", bg="#d35400", fg="white", 
                                 font=("Arial", 12, "bold"), width=25, command=self.do_publish)
        self.btn_pub.pack(pady=25)
        
        self.file_path = ""

    def select_file(self):
        self.file_path = filedialog.askopenfilename()
        if self.file_path:
            self.lbl_path.config(text=os.path.basename(self.file_path), fg="black")

    def do_publish(self):
        tid, desc, price = self.entry_id.get(), self.text_desc.get("1.0", "end-1c"), self.entry_price.get()
        if not (tid and desc and price and self.file_path):
            messagebox.showwarning("错误", "馆长，请填完所有信息再发布。")
            return

        try:
            g = Github(TOKEN)
            repo = g.get_repo(REPO_NAME)
            
            # 1. 上传图片到 images/
            img_name = os.path.basename(self.file_path)
            with open(self.file_path, "rb") as f:
                repo.create_file(f"images/{img_name}", f"Update {img_name}", f.read(), branch="main")

            # 2. 生成 JSON 并上传到 tasks/
            # 注意这里 JSON 里的 img 路径要和 index.html 匹配
            content = f'{{"id":"{tid}","desc":"{desc}","img":"images/{img_name}","price":"{price} MYR"}}'
            repo.create_file(f"tasks/{tid}.json", f"Add task {tid}", content, branch="main")

            messagebox.showinfo("成功", f"任务 {tid} 已成功发布！\n网页大约在1分钟后刷新可见。")
        except Exception as e:
            messagebox.showerror("同步失败", f"GitHub 拒绝了请求: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    VoyagerPublisher(root)
    root.mainloop()
