const nodemailer = require("nodemailer");

// دالة إرسال إيميل عامة
const sendEmail = async (options) => {
  // 1) إنشاء transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // التحقق من الـ transporter
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Erreur de vérification du transporteur:", error);
    } else {
      console.log("✅ Le transporteur est prêt à envoyer des e-mails");
    }
  });

  // 2) تحديد خيارات الإيميل
  const mailOpts = {
    from: `${process.env.EMAIL_FROM_NAME || "StorePro"} <${
      process.env.EMAIL_USER
    }>`,
    to: options.to || options.email,
    subject: options.subject,
    html: options.html || options.message,
    text: options.text,
  };

  // 3) إرسال الإيميل
  try {
    const info = await transporter.sendMail(mailOpts);
    console.log("✅ E-mail envoyé avec succès:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'e-mail:", error);
    return { success: false, error: error.message };
  }
};

// 1️⃣ إيميل الترحيب للعملاء
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🎉 مرحباً بك في StorePro</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 18px; color: #374151;">مرحباً <strong>${user.name}</strong>،</p>
          <p style="color: #6b7280; line-height: 1.6;">نحن سعداء جداً بانضمامك إلى StorePro!</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/shop" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ابدأ التسوق الآن
            </a>
          </div>
          <p style="color: #6b7280; margin-top: 30px;">مع أطيب التحيات،<br><strong>فريق StorePro</strong></p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>&copy; 2026 StorePro. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: "🎉 مرحباً بك في StorePro",
    html,
  });
};

// 2️⃣ إيميل تأكيد الطلب
const sendOrderConfirmationEmail = async (order, user, store) => {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${
            item.name
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left;">${
            item.price
          } ريال</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left;">${(
            item.price * item.quantity
          ).toFixed(2)} ريال</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
      <div style="max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">✅ تم تأكيد طلبك</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p style="font-size: 18px;">مرحباً <strong>${user.name}</strong>،</p>
          <p style="color: #6b7280;">شكراً لك على طلبك! تم استلام طلبك بنجاح.</p>
          <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <div style="color: #374151; margin-bottom: 8px;">رقم الطلب</div>
            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${order.orderNumber}</div>
          </div>
          <h3>تفاصيل الطلب:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 12px; text-align: right;">المنتج</th>
                <th style="padding: 12px; text-align: center;">الكمية</th>
                <th style="padding: 12px; text-align: left;">السعر</th>
                <th style="padding: 12px; text-align: left;">الإجمالي</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span>المجموع الفرعي</span>
              <span>${order.subtotal} ريال</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <span>الشحن</span>
              <span>${order.shippingCost} ريال</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 20px; font-weight: bold; color: #10b981; margin-top: 10px;">
              <span>الإجمالي</span>
              <span>${order.total} ريال</span>
            </div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/store/${store._id}/orders/${order._id}" style="display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              تتبع طلبك
            </a>
          </div>
          <p style="color: #6b7280;">مع أطيب التحيات،<br><strong>فريق StorePro</strong></p>
        </div>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
          <p>&copy; 2026 StorePro</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: `✅ تأكيد الطلب #${order.orderNumber}`,
    html,
  });
};

// 3️⃣ إيميل تحديث حالة الطلب
const sendOrderStatusUpdateEmail = async (order, user, store, oldStatus) => {
  const statusInfo = {
    confirmed: { title: "✅ تم تأكيد طلبك", color: "#3b82f6" },
    processing: { title: "📦 جاري تجهيز طلبك", color: "#8b5cf6" },
    shipped: { title: "🚚 تم شحن طلبك", color: "#f59e0b" },
    delivered: { title: "🎉 تم توصيل طلبك", color: "#10b981" },
    cancelled: { title: "❌ تم إلغاء طلبك", color: "#ef4444" },
  }[order.status] || { title: "تحديث الطلب", color: "#3b82f6" };

  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
        <div style="background: ${statusInfo.color}; padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">${statusInfo.title}</h1>
        </div>
        <div style="padding: 40px 30px;">
          <p>مرحباً <strong>${user.name}</strong>،</p>
          <p>تم تحديث حالة طلبك رقم: <strong>${order.orderNumber}</strong></p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/store/${store._id}/orders/${order._id}" style="display: inline-block; background: ${statusInfo.color}; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px;">
              تتبع طلبك
            </a>
          </div>
          <p style="color: #6b7280;">مع أطيب التحيات،<br><strong>فريق StorePro</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: `${statusInfo.title} - #${order.orderNumber}`,
    html,
  });
};

// 4️⃣ إيميل الترحيب لأصحاب المتاجر
const sendStoreOwnerWelcomeEmail = async (user, store) => {
  const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 مبروك! متجرك جاهز</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
          <p style="font-size: 18px;">مرحباً <strong>${user.name}</strong>،</p>
          <div style="font-size: 48px; margin: 20px 0;">🏪</div>
          <h2 style="color: #059669; margin: 10px 0;">${store.name}</h2>
          <p style="color: #6b7280;">متجرك الإلكتروني الجديد</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              اذهب إلى لوحة التحكم
            </a>
          </div>
          <p style="color: #6b7280;">مع أطيب التحيات،<br><strong>فريق StorePro</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: `🎉 مبروك! متجر ${store.name} جاهز الآن`,
    html,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendStoreOwnerWelcomeEmail,
};
