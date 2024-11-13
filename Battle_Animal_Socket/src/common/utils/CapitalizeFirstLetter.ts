const CapitalizeFirstLetter = async (text: string) => {
    // ตรวจสอบว่า text ไม่ใช่ค่าว่างหรือ null
    if (!text) {
        return null;
    }

    // แปลงตัวอักษรตัวแรกให้เป็นตัวใหญ่และเก็บตัวอักษรที่เหลือเป็นตัวเล็ก
    const firstLetter = text.charAt(0).toUpperCase();
    const restOfString = text.slice(1).toLowerCase();

    // รวมตัวอักษรตัวแรกที่แปลงแล้วกับตัวอักษรที่เหลือ
    return firstLetter + restOfString;
};


export  { CapitalizeFirstLetter }