import React from 'react';

export default function WordDownloadLink() {
    // 假设文件已经存在于服务器上，且路径为 '/files/report.docx'
    const fileUrl = 'reports/psychological_test_report.docx';

    return (
        <div>
            {/* <h1>点击以下链接下载报告</h1> */}
            <a 
                href={fileUrl} 
                download="psychological_test_report.docx" 
                style={{textDecoration: 'none', color: 'blue'}}
            >
                下载心理测试报告
            </a>
        </div>
    );
};
