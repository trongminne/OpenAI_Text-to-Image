  // Kiểm tra trạng thái tải sau khi tải lại trang
  window.addEventListener("load", function () {
    // Kiểm tra trạng thái tải trước đó từ Local Storage
    var isPageLoaded = localStorage.getItem("isPageLoaded");

    if (isPageLoaded === "true") {
        // Trang đã tải xong, ẩn đoạn mã HTML có lớp "loader"
        var loader = document.getElementById("preloader");
        if (loader) {
            loader.style.display = "none";
        }
    }

    // Lưu trạng thái tải vào Local Storage
    localStorage.setItem("isPageLoaded", "true");
});