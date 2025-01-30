import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./Leaderboard.scss";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Lưu giá trị tìm kiếm
    const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi lọc
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [randomCode, setRandomCode] = useState("");
    const [userInput, setUserInput] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [actionType, setActionType] = useState(null); // Xác định hành động đang thực hiện

    // Fetch API với phương thức POST
    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(
                "https://quanthanhtemple.wifimedia.vn/api/api/v1/user/all-user",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                }
            );

            if (!response.ok) {
                throw new Error("❌ Lỗi khi tải dữ liệu!");
            }

            const data = await response.json();
            setLeaderboard(data);
            setFilteredData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi tìm kiếm
    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filtered = leaderboard.filter(
            (user) =>
                user.email.toLowerCase().includes(lowercasedSearchTerm) ||
                user.phone.includes(lowercasedSearchTerm)
        );
        setFilteredData(filtered);
    }, [searchTerm, leaderboard]);

    // 🔹 Mở popup xác thực
    const openPopup = (type) => {
        setIsPopupOpen(true);
        setRandomCode(generateRandomCode());
        setUserInput("");
        setEmail("");
        setPassword("");
        setActionType(type);
    };

    // 🔹 Đóng popup
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    // 🔹 Tạo chuỗi random
    const generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // 🔹 Kiểm tra xác thực trước khi thực hiện hành động
    const handleConfirm = () => {
        if (
            email === "denQuanthanh@admin" &&
            password === "qjW123denQuanthanh456789" &&
            userInput === randomCode
        ) {
            closePopup();
            if (actionType === "export") {
                exportToExcel();
            } else if (actionType === "reset") {
                resetData();
            }
        } else {
            alert("❌ Sai thông tin hoặc mã xác nhận!");
        }
    };

    // 🔹 Xuất dữ liệu ra file Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            filteredData.map((user, index) => ({
                STT: index + 1,
                Email: user.email,
                "Số điện thoại": user.phone,
                "Điểm số": user.score?.toLocaleString(),
            }))
        );

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leaderboard");
        XLSX.writeFile(wb, "leaderboard.xlsx");
    };

    // 🔹 Reset dữ liệu
    const resetData = async () => {
        try {
            const response = await fetch(
                "https://quanthanhtemple.wifimedia.vn/api/api/v1/user/reset",
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error("❌ Lỗi khi reset dữ liệu!");
            }

            alert("✅ Reset dữ liệu thành công!");
            
            // Gọi lại API để cập nhật bảng xếp hạng
            fetchLeaderboard();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="leaderboard">
            <div className="leaderboard-container">
                <h1 className="leaderboard-title">Bảng Xếp Hạng</h1>

                {/* 🔹 Nút Xuất Excel & Reset */}
                <div className="button-group">
                    <button onClick={() => openPopup("export")} className="export-btn">📄 Xuất Excel</button>
                    <button onClick={() => openPopup("reset")} className="reset-btn">🔄 Reset dữ liệu</button>
                </div>

                {/* 🔹 Bảng Leaderboard */}
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Điểm số</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.score?.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🔹 Popup xác thực */}
            {isPopupOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>⚠️ Cảnh báo</h2>
                        <p>
                            Bạn đang thực hiện hành động: <strong>{actionType === "export" ? "📄 Xuất Excel" : "🔄 Reset dữ liệu"}</strong>.
                        </p>
                        <p>Vui lòng nhập thông tin chính xác để tiếp tục.</p>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                        <input 
                            type="password" 
                            placeholder="Mật khẩu" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                        <p>Mã xác nhận: <strong>{randomCode}</strong></p>
                        <input 
                            type="text" 
                            placeholder="Nhập mã xác nhận" 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)} 
                            required 
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                        />
                        <div className="popup-buttons">
                            <button onClick={handleConfirm}>✅ Xác nhận</button>
                            <button onClick={closePopup}>❌ Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
