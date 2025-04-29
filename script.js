// سجل التنقل
let navigationHistory = ["home"];

// إنشاء متغير عام لتتبع الإشعارات
let notificationsCount = {
  general: 0,
};

// مصفوفة الإشعارات
let notifications = [];

// وظيفة لعرض الإشعارات المحسنة
function showNotification(message, type = "info", duration = 3000) {
  // التحقق من وجود عنصر الإشعار
  // let notification = document.querySelector(".notification");
  // // إنشاء عنصر الإشعار إذا لم يكن موجوداً
  // if (!notification) {
  //   notification = document.createElement("div");
  //   notification.className = "notification";
  //   document.body.appendChild(notification);
  // }
  // // تحديد الأيقونة حسب النوع
  // let icon = "fa-info-circle";
  // switch (type) {
  //   case "success":
  //     icon = "fa-check-circle";
  //     break;
  //   case "warning":
  //     icon = "fa-exclamation-triangle";
  //     break;
  //   case "error":
  //     icon = "fa-times-circle";
  //     break;
  //   case "info":
  //     icon = "fa-info-circle";
  //     break;
  // }
  // // تعيين المحتوى والفئة
  // notification.className = "notification";
  // notification.classList.add(type);
  // notification.innerHTML = `<i class="fas ${icon}"></i>${message}`;
  // // إضافة زر إغلاق
  // const closeButton = document.createElement("i");
  // closeButton.className = "fas fa-times notification-close";
  // closeButton.style.marginRight = "10px";
  // closeButton.style.cursor = "pointer";
  // closeButton.style.marginLeft = "0";
  // notification.appendChild(closeButton);
  // // إضافة مستمع حدث لزر الإغلاق
  // closeButton.addEventListener("click", () => {
  //   notification.classList.remove("show");
  // });
  // // إظهار الإشعار
  // notification.classList.add("show");
  // // إخفاء الإشعار بعد المدة المحددة
  // setTimeout(() => {
  //   notification.classList.remove("show");
  // }, duration);
  // // إضافة الإشعار إلى قائمة الإشعارات
  // addToNotificationCenter(message, type);
}

// وظيفة لإضافة إشعار إلى مركز الإشعارات
function addToNotificationCenter(message, type, title = "") {
  const currentDate = new Date();
  const notificationObj = {
    id: Date.now(),
    message: message,
    type: type,
    title: title || getNotificationTitle(type),
    time: formatNotificationTime(currentDate),
    timestamp: currentDate,
    read: false,
  };

  // إضافة الإشعار إلى المصفوفة
  notifications.unshift(notificationObj);

  // تحديث عداد الإشعارات
  notificationsCount.general++;

  // تحديث واجهة المستخدم
  updateNotificationBadges();
  updateNotificationDropdowns();
}

// وظيفة لتنسيق وقت الإشعار
function formatNotificationTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) {
    return "الآن";
  } else if (diffMins < 60) {
    return `منذ ${diffMins} دقيقة`;
  } else if (diffHours < 24) {
    return `منذ ${diffHours} ساعة`;
  } else if (diffDays < 7) {
    return `منذ ${diffDays} يوم`;
  } else {
    return date.toLocaleDateString("ar-SA");
  }
}

// وظيفة للحصول على عنوان الإشعار بناءً على نوعه
function getNotificationTitle(type) {
  switch (type) {
    case "success":
      return "نجاح";
    case "warning":
      return "تنبيه";
    case "error":
      return "خطأ";
    case "info":
    default:
      return "معلومات";
  }
}

// وظيفة لتحديث شارات الإشعارات
function updateNotificationBadges() {
  // عرض عدد الإشعارات غير المقروءة
  const notificationIcons = document.querySelectorAll(".notification-icon");
  notificationIcons.forEach((icon) => {
    // إزالة شارة الإشعارات القديمة إن وجدت
    let badge = icon.querySelector(".notification-badge");
    if (badge) {
      badge.remove();
    }

    // إضافة شارة جديدة إذا كان هناك إشعارات غير مقروءة
    if (notificationsCount.general > 0) {
      badge = document.createElement("div");
      badge.className = "notification-badge";
      badge.textContent = notificationsCount.general;
      icon.appendChild(badge);
    }
  });
}

// وظيفة لتحديث قوائم الإشعارات المنسدلة
function updateNotificationDropdowns() {
  const notificationLists = document.querySelectorAll(".notifications-list");

  notificationLists.forEach((list) => {
    // مسح المحتوى الحالي
    list.innerHTML = "";

    if (notifications.length === 0) {
      // إظهار رسالة إذا لم توجد إشعارات
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-notifications";
      emptyDiv.innerHTML = `
        <i class="fas fa-bell-slash"></i>
        <p>لا توجد إشعارات جديدة</p>
      `;
      list.appendChild(emptyDiv);
    } else {
      // إضافة الإشعارات
      notifications.forEach((notification) => {
        const notificationItem = document.createElement("div");
        notificationItem.className = "notification-item";
        if (!notification.read) {
          notificationItem.classList.add("unread");
        }

        notificationItem.innerHTML = `
          <div class="notification-content">
            <div class="notification-title">${notification.title}</div>
            <div class="notification-message">${notification.message}</div>
            <span class="notification-time">${notification.time}</span>
          </div>
        `;

        // إضافة مستمع حدث للنقر على الإشعار
        notificationItem.addEventListener("click", () => {
          markNotificationAsRead(notification.id);
        });

        list.appendChild(notificationItem);
      });
    }
  });
}

// وظيفة لتعيين إشعار كمقروء
function markNotificationAsRead(id) {
  const index = notifications.findIndex((item) => item.id === id);
  if (index !== -1 && !notifications[index].read) {
    notifications[index].read = true;
    notificationsCount.general--;
    updateNotificationBadges();
    updateNotificationDropdowns();
  }
}

// وظيفة لتعيين جميع الإشعارات كمقروءة
function markAllNotificationsAsRead() {
  let unreadCount = 0;

  notifications.forEach((notification) => {
    if (!notification.read) {
      notification.read = true;
      unreadCount++;
    }
  });

  if (unreadCount > 0) {
    notificationsCount.general = 0;
    updateNotificationBadges();
    updateNotificationDropdowns();
    showNotification("تم تعيين جميع الإشعارات كمقروءة", "success", 2000);
  }
}

// تهيئة التطبيق
document.addEventListener("DOMContentLoaded", () => {
  // إضافة مستمعي الأحداث للتبويبات
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetScreen = tab.getAttribute("data-screen");
      switchScreen(targetScreen);
      showNotification(
        `تم الانتقال إلى ${tab.querySelector("span").textContent}`,
        "success",
        2000
      );
    });
  });

  // إضافة مستمعي الأحداث لعناصر القائمة
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const itemText = item.querySelector("span").textContent;
      handleMenuItemClick(itemText);
    });
  });

  // إضافة مستمعي الأحداث للقائمة المنسدلة
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation(); // منع انتشار الحدث
      const itemText = item.querySelector("span").textContent;
      handleDropdownItemClick(itemText);
    });
  });

  // إضافة مستمع حدث لإغلاق القائمة المنسدلة عند النقر في أي مكان آخر
  document.addEventListener("click", (e) => {
    const dropdownMenus = document.querySelectorAll(".dropdown-menu");
    dropdownMenus.forEach((menu) => {
      if (menu.style.display === "block") {
        const container = menu.closest(
          ".avatar-container, .notifications-container"
        );
        if (!container.contains(e.target)) {
          menu.style.display = "none";
        }
      }
    });
  });

  // إضافة مستمعي الأحداث للصور الشخصية لعرض/إخفاء القائمة المنسدلة
  const avatarContainers = document.querySelectorAll(".avatar-container");
  avatarContainers.forEach((container) => {
    container.addEventListener("click", () => {
      const menu = container.querySelector(".dropdown-menu");
      const isVisible = menu.style.display === "block";
      // إغلاق جميع القوائم المنسدلة الأخرى
      document.querySelectorAll(".dropdown-menu").forEach((m) => {
        m.style.display = "none";
      });
      // عرض/إخفاء القائمة المنسدلة الحالية
      menu.style.display = isVisible ? "none" : "block";
    });
  });

  // إضافة مستمعي الأحداث لأيقونات الإشعارات
  const notificationContainers = document.querySelectorAll(
    ".notifications-container"
  );
  notificationContainers.forEach((container) => {
    container.addEventListener("click", () => {
      const menu = container.querySelector(".dropdown-menu");
      const isVisible = menu.style.display === "block";
      // إغلاق جميع القوائم المنسدلة الأخرى
      document.querySelectorAll(".dropdown-menu").forEach((m) => {
        m.style.display = "none";
      });
      // عرض/إخفاء قائمة الإشعارات
      menu.style.display = isVisible ? "none" : "block";
    });
  });

  // إضافة مستمعي الأحداث لأزرار "تعيين الكل كمقروء"
  const markAllReadButtons = document.querySelectorAll(".mark-all-read");
  markAllReadButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // منع انتشار الحدث
      markAllNotificationsAsRead();
    });
  });

  // تهيئة قوائم الإشعارات
  updateNotificationDropdowns();

  // إظهار إشعار ترحيبي بعد تحميل التطبيق
  setTimeout(() => {
    showNotification("مرحباً بك في تطبيق وثيق", "info", 3000);
  }, 500);

  // محاكاة استلام إشعارات جديدة
  setTimeout(() => {
    showNotification("لديك موعد غداً الساعة 10 صباحاً", "info", 3000);
  }, 5000);

  setTimeout(() => {
    showNotification("تم تأكيد الطلب #123456", "success", 3000);
  }, 8000);
});

// تبديل الشاشات
function switchScreen(screenId) {
  // إخفاء جميع الشاشات
  const screens = document.querySelectorAll(".screen");
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  // إظهار الشاشة المطلوبة
  const targetScreen = document.getElementById(screenId);
  targetScreen.classList.add("active");

  // تحديث التبويب النشط
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.classList.remove("active");
    if (tab.getAttribute("data-screen") === screenId) {
      tab.classList.add("active");
    }
  });

  // إغلاق جميع القوائم المنسدلة
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.display = "none";
  });

  // تحديث سجل التنقل
  if (navigationHistory[navigationHistory.length - 1] !== screenId) {
    navigationHistory.push(screenId);
  }
}

// معالجة النقر على عناصر القائمة
function handleMenuItemClick(itemText) {
  // يمكنك إضافة منطق خاص لكل عنصر في القائمة هنا
  console.log(`تم النقر على: ${itemText}`);

  // مثال على معالجة بعض العناصر
  switch (itemText) {
    case "الملف الشخصي":
      // معالجة الانتقال إلى صفحة الملف الشخصي
      showNotification("جارٍ تحميل الملف الشخصي", "info");
      // محاكاة تحميل البيانات
      setTimeout(() => {
        showNotification("تم تحميل الملف الشخصي بنجاح", "success");
      }, 1500);
      break;
    case "المواعيد":
      // معالجة الانتقال إلى صفحة المواعيد
      showNotification("جارٍ تحميل المواعيد", "info");
      // محاكاة وجود مواعيد قادمة
      setTimeout(() => {
        showNotification("لديك 3 مواعيد في الأسبوع القادم", "warning");
      }, 1200);
      break;
    case "موقعك":
      showNotification("جارٍ تحديد موقعك الحالي...", "info");
      setTimeout(() => {
        showNotification("تم تحديد موقعك بنجاح", "success");
      }, 2000);
      break;
    case "القالب":
      showNotification("جارٍ تحميل خيارات القالب", "info");
      setTimeout(() => {
        showNotification("تم تحديث القالب بنجاح", "success");
      }, 1000);
      break;
    case "الخدمات":
      showNotification("جارٍ تحميل الخدمات المتاحة", "info");
      // محاكاة وجود خدمات جديدة
      setTimeout(() => {
        showNotification("تم إضافة 5 خدمات جديدة هذا الأسبوع", "info");
      }, 1500);
      break;
    case "الأعمال":
      showNotification("جارٍ تحميل سجل الأعمال", "info");
      setTimeout(() => {
        showNotification("تم تحميل سجل الأعمال بنجاح", "success");
      }, 1700);
      break;
    case "الباقة":
      showNotification("جارٍ التحقق من معلومات الباقة الحالية", "info");
      setTimeout(() => {
        showNotification("باقتك صالحة حتى نهاية الشهر الحالي", "info");
      }, 1200);
      break;
    case "المحفظة":
      showNotification("جارٍ تحميل معلومات المحفظة", "info");
      setTimeout(() => {
        showNotification("رصيد محفظتك الحالي: 500 ريال", "success");
      }, 1500);
      break;
    case "الإعدادات":
      showNotification("جارٍ فتح الإعدادات", "info");
      break;
    case "تسجيل خروج":
      // معالجة تسجيل الخروج
      showNotification("جارٍ تسجيل الخروج...", "warning");
      setTimeout(() => {
        showNotification("تم تسجيل الخروج بنجاح", "success");
      }, 1500);
      break;
    default:
      // معالجة العناصر الأخرى
      showNotification(`تم تحديد: ${itemText}`, "info");
      break;
  }
}

// معالجة النقر على عناصر القائمة المنسدلة
function handleDropdownItemClick(itemText) {
  console.log(`تم النقر على عنصر القائمة المنسدلة: ${itemText}`);

  switch (itemText) {
    case "الملف الشخصي":
      // الانتقال إلى الملف الشخصي
      showNotification("جارٍ الانتقال إلى الملف الشخصي", "info");
      // محاكاة تحميل البيانات
      setTimeout(() => {
        showNotification("تم تحميل الملف الشخصي بنجاح", "success");
      }, 1500);
      break;
    case "تسجيل خروج":
      // تنفيذ عملية تسجيل الخروج
      showNotification("جارٍ تسجيل الخروج...", "warning");
      setTimeout(() => {
        showNotification("تم تسجيل الخروج بنجاح", "success");
      }, 1500);
      break;
    default:
      break;
  }

  // إغلاق القائمة المنسدلة
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.display = "none";
  });
}

// وظيفة العودة للخلف
function goBack() {
  if (navigationHistory.length > 1) {
    navigationHistory.pop(); // إزالة الشاشة الحالية
    const previousScreen = navigationHistory[navigationHistory.length - 1];
    showNotification("جارٍ العودة للصفحة السابقة", "info", 1500);
    switchScreen(previousScreen);
  } else {
    showNotification("أنت في الصفحة الرئيسية بالفعل", "warning", 2000);
  }
}

// إضافة مستمع حدث للزر الخلفي في المتصفح
window.addEventListener("popstate", () => {
  goBack();
});
