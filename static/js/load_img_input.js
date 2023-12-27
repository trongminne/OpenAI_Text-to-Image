function displayImage() {
    const fileInput = document.getElementById('file');
    const fileLabel = document.getElementById('fileLabel');
    const imagePreview = document.getElementById('imagePreview');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        // Kiểm tra kích thước tệp (không quá 4MB)
        if (file.size <= 4 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Hiển thị hình ảnh trên giao diện
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.innerHTML = '';
                imagePreview.appendChild(img);
                imagePreview.style.display = 'block';
                
                // Thay đổi nội dung của label thành "Chọn ảnh khác" và biểu tượng SVG mới
                fileLabel.innerHTML = `
                <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g>
                </svg> 
                <p>Chọn lại ảnh</p>
               
                `;
            };
            reader.readAsDataURL(file);
        } else {
            // Hiển thị thông báo nếu tệp quá lớn
            alert('Tệp ảnh quá lớn! Vui lòng chọn tệp dưới 4MB.');
            fileInput.value = ''; // Xóa tệp đã chọn
        }
    } else {
        // Khôi phục nội dung của label khi không có tệp nào được chọn
        fileLabel.innerHTML = `
            <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g>
            </svg> 
            <p>chưa có file</p>
            
        `;
        imagePreview.style.display = 'none'; // Ẩn hình ảnh
    }
}

// reset form
function clearForm() {
    // Xóa giá trị của input text
    document.getElementById('user_input').value = '';
    
    // Ẩn hình ảnh được hiển thị
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.style.display = 'none';
    
    // Khôi phục nội dung của label "Chọn ảnh"
    const fileLabel = document.getElementById('fileLabel');
    fileLabel.innerHTML = `
    
    <svg
    fill="#000000"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
      <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
    </g>
  </svg>
  <p>Chọn ảnh</p>
`;

}
