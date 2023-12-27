// Khai báo biến và cài đặt các cờ trạng thái ban đầu
let recognition;
let isRecording = false;
let isInitialOk = false;
let isSecondOk = false;
let recordedText = "";

// Khởi tạo đối tượng SpeechRecognition để nhận diện giọng nói
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.continuous = true;

  // Xử lý sự kiện kết quả từ việc nhận diện giọng nói
  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("Đã nhận dạng:", transcript);

    // Xử lý khi người dùng nói 'ok' lần đầu
    if (!isRecording && transcript.toLowerCase().includes("hello")) {
      if (!isInitialOk) {
        // Hiển thị thông báo thành công
        swal.fire({
          title: "Thành công",
          text: "Nhận dạng giọng nói thành công",
          icon: "success",
          showConfirmButton: false, // Tắt nút OK
        });

        // Đặt thời gian độ trễ 0.5s và sau đó ẩn thông báo
        setTimeout(() => {
          const swalOverlay = document.querySelector(".swal2-container");
          if (swalOverlay) {
            swalOverlay.remove(); // Loại bỏ lớp chứa hộp thoại để ẩn đi
          }
        }, 2000);

        isInitialOk = true;
      }
      console.log("Bắt đầu ghi âm");
      isRecording = true;
      recordedText = "";
    }
    // Xử lý khi người dùng nói 'tải xuống'
    else if (!isRecording && transcript.toLowerCase().includes("tải xuống")) {
      // Tìm phần tử hình ảnh
      const imageElement = document.querySelector(".img-ai");

      if (imageElement) {
        // Lấy đường dẫn ảnh từ thuộc tính src
        const imageUrl = imageElement.getAttribute("src");

        // Tạo một liên kết tải xuống
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "image.jpg"; // Tên file khi tải xuống
        link.target = "_blank"; // Mở liên kết trong tab/ cửa sổ mới
        link.click(); // Bấm vào liên kết để tải xuống
      } else {
        console.log("Không tìm thấy phần tử hình ảnh để tải xuống.");
      }
    } else if (transcript.toLowerCase().includes("hướng dẫn")) {
      // Hiển thị thông báo hướng dẫn
      swal.fire({
        title: "Hướng dẫn",
        text: "Lưu ý: Trái - lệnh, phải - chức năng. hello: khởi động mic -> lời miêu tả ảnh -> đồng ý: đồng ý | thoát: thoát -> tải xuống: tải ảnh -> ảnh khác: vẽ lại -> tải lại: quay về ban đầu -> kết thúc: dừng mic",
        icon: "info",
      });
    } // Xử lý sự kiện khi người dùng nói 'ok' để kích hoạt hướng dẫn
    else if (transcript.toLowerCase().includes("ok")) {
      // Kích hoạt hướng dẫn bằng cách mô phỏng bấm nút "OK"
      console.log("ok");

      simulateGuideOkButtonClick();
      location.reload(); // Tải lại trang
    }

    // Xử lý khi đang ghi âm và người dùng nói 'ok' để đồng ý tạo ảnh
    // Xử lý khi đang ghi âm và người dùng nói 'đồng ý'
    else if (isRecording) {
      recordedText = transcript;
      swal.fire({
        title: "Xác nhận",
        text: "Bạn muốn tạo ảnh " + recordedText + " phải không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
      });
      if (transcript.toLowerCase().includes("thoát")) {
        recordedText = ""; // Đặt lại giá trị recordedText để chuẩn bị cho lần tiếp theo
        simulateCancelButtonClick(); // Tự động chọn nút "Hủy"
      }
      if (transcript.toLowerCase().includes("đồng ý")) {
        recordedText = recordedText.replace("đồng ý", "").trim(); // Xóa chuỗi 'đồng ý'
        simulateConfirmButtonClick(); // Tự động chọn nút "Đồng ý"
      }
      document.getElementById("email").value = recordedText;
    } else if (transcript.toLowerCase().includes("kết thúc")) {
      // Hiển thị thông báo thành công
      swal.fire({
        title: "Kết thúc",
        text: "Kết thúc ghi âm",
        icon: "info",
        showConfirmButton: false, // Tắt nút OK
      });

      // Đặt thời gian độ trễ 0.5s và sau đó ẩn thông báo
      setTimeout(() => {
        const swalOverlay = document.querySelector(".swal2-container");
        if (swalOverlay) {
          swalOverlay.remove(); // Loại bỏ lớp chứa hộp thoại để ẩn đi
        }
      }, 2000);
      isRecording = false;
      recognition.stop(); // Dừng nhận diện khi kết thúc ghi âm
    } // Xử lý khi người dùng nói 'tải lại trang'
    else if (transcript.toLowerCase().includes("tải lại")) {
      const currentUrl = window.location.href;
      window.location.href = currentUrl; // Chuyển đến URL hiện tại để tải lại trang
    } else if (transcript.toLowerCase().includes("ảnh khác")) {
      location.reload(); // Tải lại trang
    }
  };

  // Thêm hàm simulateGuideOkButtonClick() để tự động chọn nút "OK" trong hộp thoại hướng dẫn:
  function simulateGuideOkButtonClick() {
    console.log("ok");
    const guideOkButton = document.querySelector(".swal2-confirm");
    if (guideOkButton) {
      guideOkButton.click();
    }
  }
  // Thêm hàm simulateConfirmButtonClick() để tự động chọn nút "Đồng ý":
  function simulateConfirmButtonClick() {
    const confirmButton = document.querySelector(".swal2-confirm");
    if (confirmButton) {
      confirmButton.click();
      document.getElementById("limpar").click();
    }
  }

  // Thêm hàm simulateCancelButtonClick() để tự động chọn nút "Hủy"
  function simulateCancelButtonClick() {
    const cancelButton = document.querySelector(".swal2-cancel");
    if (cancelButton) {
      cancelButton.click();
      document.getElementById("email").value = ""; // Đặt lại giá trị recordedText khi người dùng chọn "Hủy"
    }
  }

  // Xử lý sự kiện khi việc nhận diện giọng nói kết thúc
  recognition.onend = () => {
    if (isRecording) {
      recognition.start(); // Khởi động lại nhận diện nếu vẫn đang ghi âm
    }
  };

  // Tự động bắt đầu nhận diện khi trang được tải
  window.onload = () => {
    recognition.start();
  };
} else {
  swal.fire("Lỗi", "Trình duyệt không hỗ trợ chức năng này.", "error");
}
