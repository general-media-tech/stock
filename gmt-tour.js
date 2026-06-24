/* ════════════════════════════════════════════════════════════════
   gmt-tour.js — البرنامج التعليمي المشترك لكل ملفات GMT Systems
   ════════════════════════════════════════════════════════════════
   يشمل:
   1. شاشة التحميل (Loading Screen) مع شريط تقدم
   2. شاشات الترحيب التعريفية (Onboarding Slides) — مرة واحدة فقط
   3. الجولة التفاعلية (Interactive Tour) — قابلة للإعادة
   ════════════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────
   شاشات الترحيب — مشتركة لكل الملفات
──────────────────────────────────────────────── */
const GMT_WELCOME_SLIDES = [
  {
    icon: '🏢',
    bg: 'linear-gradient(135deg,#C41230 0%,#8B0000 100%)',
    title: 'أهلاً بك في GMT Systems',
    subtitle: 'نظام إدارة محاسبي ذكي',
    body: `صُمِّم هذا النظام خصيصاً لـ
           <b>مجموعة ميديا تيك التجارية</b>
           <br>(General Media Tech)<br><br>
           لإدارة المبيعات، المخزون، والشحن عبر جميع الفروع في مكان واحد.`
  },
  {
    icon: '👤',
    bg: 'linear-gradient(135deg,#1d4ed8 0%,#1e3a8a 100%)',
    title: 'الإدارة المركزية',
    subtitle: 'المدير العام: محمد خير زيتوني',
    body: `يُشرف المدير العام على كل العمليات من لوحة الأدمن.<br><br>
           كل تصرف تقوم به في النظام — كل فاتورة، كل نقل، كل بيع —
           <b>مرئي بالكامل للإدارة</b> في الوقت الفعلي.`
  },
  {
    icon: '👁️',
    bg: 'linear-gradient(135deg,#d97706 0%,#92400e 100%)',
    title: 'الشفافية الكاملة',
    subtitle: 'كل شيء مُسجَّل ومُتتبَّع',
    body: `✅ كل فاتورة بيع — مسجلة باسمك<br>
           ✅ كل نقل بضاعة — يحتاج توقيع<br>
           ✅ كل تحصيل — يدخل الصندوق مباشرة<br>
           ✅ الأدمن يرى كل شيء لحظة بلحظة<br><br>
           <b>العمل بنزاهة يحميك ويحمي الجميع.</b>`
  },
  {
    icon: '🏪',
    bg: 'linear-gradient(135deg,#059669 0%,#064e3b 100%)',
    title: 'الفروع والأقسام',
    subtitle: 'نظام متكامل لكل نقطة بيع',
    body: `كل فرع لديه:<br>
           📦 <b>مخزون مستقل</b> — تتابعه بالجرد<br>
           💰 <b>صندوق خاص</b> — يظهر غلتك اليومية<br>
           📋 <b>سجل كامل</b> — مشتريات + نقل + مبيعات<br>
           🚚 <b>نظام نقل</b> — بين الفروع بفواتير رسمية`
  },
  {
    icon: '🚀',
    bg: 'linear-gradient(135deg,#7c3aed 0%,#4c1d95 100%)',
    title: 'جاهز للبدء؟',
    subtitle: 'الجولة التعليمية ستشرح كل شيء',
    body: `ستظهر لك الآن جولة تفاعلية قصيرة
           تشرح كل زر وكل ميزة في هذه الصفحة.<br><br>
           يمكنك إعادة الجولة في أي وقت بالضغط على<br>
           <b>🎓 إعادة الجولة</b> من أي مكان في النظام.`
  }
];

/* ────────────────────────────────────────────────
   شاشة التحميل
──────────────────────────────────────────────── */
window.GMTLoadingScreen = {
  show(pageTitle) {
    if (document.getElementById('gmt-loading-screen')) return;
    const el = document.createElement('div');
    el.id = 'gmt-loading-screen';
    el.style.cssText = [
      'position:fixed;inset:0;z-index:999999;',
      'background:linear-gradient(135deg,#C41230 0%,#8B0000 100%);',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;',
      'font-family:"Cairo",sans-serif;direction:rtl;transition:opacity 0.5s;'
    ].join('');
    el.innerHTML = `
      <div style="margin-bottom:24px;">
        <img src="logo.jpg" style="height:80px;filter:brightness(0) invert(1);"
             onerror="this.style.display='none'">
      </div>
      <div style="color:white;font-size:24px;font-weight:900;margin-bottom:4px;">
        General Media Tech
      </div>
      <div style="color:rgba(255,255,255,0.7);font-size:13px;font-weight:700;margin-bottom:6px;">
        مجموعة ميديا تيك التجارية
      </div>
      <div style="color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;margin-bottom:36px;">
        ${pageTitle || ''}
      </div>
      <div style="width:240px;background:rgba(255,255,255,0.2);border-radius:999px;height:6px;margin-bottom:12px;">
        <div id="gmt-loading-bar" style="width:0%;height:100%;background:white;border-radius:999px;transition:width 0.4s ease;"></div>
      </div>
      <div id="gmt-loading-text" style="color:rgba(255,255,255,0.8);font-size:11px;font-weight:700;">
        جارٍ تهيئة النظام...
      </div>`;
    document.body.appendChild(el);
  },

  update(text, pct) {
    const bar  = document.getElementById('gmt-loading-bar');
    const txt  = document.getElementById('gmt-loading-text');
    if (bar && pct !== undefined) bar.style.width = Math.min(100, pct) + '%';
    if (txt && text) txt.textContent = text;
  },

  hide(onDone) {
    const el = document.getElementById('gmt-loading-screen');
    if (!el) { onDone && onDone(); return; }
    el.style.opacity = '0';
    setTimeout(() => { el.remove(); onDone && onDone(); }, 500);
  }
};

/* تشغيل متسلسل لخطوات التحميل مع شريط التقدم */
window.gmtRunLoading = async function(steps, pageId, pageTitle) {
  GMTLoadingScreen.show(pageTitle);
  const total = steps.length;
  for (let i = 0; i < steps.length; i++) {
    GMTLoadingScreen.update(steps[i].label, Math.round((i / total) * 90));
    try { await steps[i].fn(); } catch(e) { console.warn('[gmt-tour] step error:', e.message); }
    await new Promise(r => setTimeout(r, 80));
  }
  GMTLoadingScreen.update('اكتمل التحميل ✓', 100);
  await new Promise(r => setTimeout(r, 300));

  GMTLoadingScreen.hide(() => {
    const onboarded = localStorage.getItem('gmt_onboarded_' + pageId);
    if (!onboarded) {
      window.gmtShowWelcome(pageId);
    } else {
      const tourDone = localStorage.getItem('tour_done_' + pageId);
      if (!tourDone && window._gmtTour) {
        setTimeout(() => window._gmtTour.start(), 400);
      }
    }
  });
};

/* ────────────────────────────────────────────────
   شاشات الترحيب
──────────────────────────────────────────────── */
window.gmtShowWelcome = function(pageId) {
  let current = 0;

  const overlay = document.createElement('div');
  overlay.id = 'gmt-welcome-overlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:999998;',
    'display:flex;align-items:center;justify-content:center;',
    'font-family:"Cairo",sans-serif;direction:rtl;padding:16px;',
    'transition:background 0.4s;'
  ].join('');

  function renderSlide(idx) {
    const s = GMT_WELCOME_SLIDES[idx];
    overlay.style.background = s.bg;
    overlay.innerHTML = `
      <div style="max-width:420px;width:100%;text-align:center;color:white;">
        <!-- نقاط التقدم -->
        <div style="display:flex;gap:6px;justify-content:center;margin-bottom:32px;">
          ${GMT_WELCOME_SLIDES.map((_,i) => `
            <div style="width:${i===idx?28:8}px;height:8px;border-radius:999px;
                        background:${i===idx?'white':'rgba(255,255,255,0.3)'};
                        transition:all 0.3s;"></div>`).join('')}
        </div>
        <div style="font-size:60px;margin-bottom:16px;">${s.icon}</div>
        <div style="font-size:22px;font-weight:900;margin-bottom:6px;">${s.title}</div>
        <div style="font-size:13px;font-weight:700;opacity:0.8;margin-bottom:24px;">${s.subtitle}</div>
        <div style="font-size:14px;line-height:1.9;opacity:0.9;margin-bottom:36px;
                    background:rgba(0,0,0,0.15);border-radius:16px;padding:20px;text-align:right;">
          ${s.body}
        </div>
        <div style="display:flex;gap:12px;justify-content:center;">
          ${idx > 0 ? `
            <button id="gmt-slide-prev"
              style="background:rgba(255,255,255,0.2);color:white;border:none;
                     padding:12px 24px;border-radius:12px;font-family:'Cairo';
                     font-size:13px;font-weight:700;cursor:pointer;">
              ← السابق
            </button>` : ''}
          <button id="gmt-slide-next"
            style="background:white;color:#374151;border:none;
                   padding:12px 36px;border-radius:12px;font-family:'Cairo';
                   font-size:14px;font-weight:900;cursor:pointer;
                   box-shadow:0 4px 16px rgba(0,0,0,0.2);">
            ${idx === GMT_WELCOME_SLIDES.length - 1 ? '🚀 ابدأ الجولة' : 'التالي →'}
          </button>
        </div>
        ${idx < GMT_WELCOME_SLIDES.length - 1 ? `
          <button id="gmt-slide-skip"
            style="background:none;color:rgba(255,255,255,0.5);border:none;
                   margin-top:16px;font-family:'Cairo';font-size:12px;cursor:pointer;">
            تخطي الكل
          </button>` : ''}
      </div>`;

    document.getElementById('gmt-slide-next')?.addEventListener('click', () => {
      current++;
      if (current >= GMT_WELCOME_SLIDES.length) finishWelcome();
      else renderSlide(current);
    });
    document.getElementById('gmt-slide-prev')?.addEventListener('click', () => {
      current--;
      renderSlide(current);
    });
    document.getElementById('gmt-slide-skip')?.addEventListener('click', finishWelcome);
  }

  function finishWelcome() {
    overlay.remove();
    localStorage.setItem('gmt_onboarded_' + pageId, 'true');
    setTimeout(() => window._gmtTour?.start(), 300);
  }

  document.body.appendChild(overlay);
  renderSlide(0);
};

/* ────────────────────────────────────────────────
   كلاس الجولة التفاعلية
──────────────────────────────────────────────── */
class GMTTour {
  constructor(steps, storageKey) {
    this.steps      = steps || [];
    this.storageKey = storageKey;
    this.current    = 0;
    this.overlay    = null;
    this.card       = null;
  }

  isDone() {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  start(force = false) {
    if (this.isDone() && !force) return;
    this.current = 0;
    this._createUI();
    this._showStep(0);
  }

  _createUI() {
    // إزالة أي جولة سابقة
    document.getElementById('gmt-tour-overlay')?.remove();
    document.getElementById('gmt-tour-card')?.remove();

    this.overlay = document.createElement('div');
    this.overlay.id = 'gmt-tour-overlay';
    this.overlay.style.cssText = [
      'position:fixed;inset:0;z-index:99998;pointer-events:none;',
      'background:rgba(0,0,0,0.5);'
    ].join('');

    this.card = document.createElement('div');
    this.card.id = 'gmt-tour-card';
    this.card.style.cssText = [
      'position:fixed;z-index:99999;',
      'background:white;border-radius:16px;padding:20px 24px;',
      'max-width:320px;width:calc(100vw - 32px);',
      'box-shadow:0 20px 60px rgba(0,0,0,0.3);',
      'font-family:"Cairo",sans-serif;direction:rtl;',
      'pointer-events:all;'
    ].join('');

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.card);
  }

  _showStep(index) {
    if (!this.card) return;
    const step = this.steps[index];
    if (!step) { this.finish(); return; }

    // تمييز العنصر المستهدف
    this._clearHighlight();
    const target = document.querySelector(step.target);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.dataset.gmtTourHighlight = '1';
      target.style.outline       = '3px solid #C41230';
      target.style.outlineOffset = '4px';
      target.style.borderRadius  = target.style.borderRadius || '8px';
      target.style.position      = target.style.position || 'relative';
      target.style.zIndex        = '100000';

      // موضع البطاقة
      setTimeout(() => {
        const rect = target.getBoundingClientRect();
        const cardH = 220;
        let top = rect.bottom + 12;
        if (top + cardH > window.innerHeight - 16) top = Math.max(16, rect.top - cardH - 12);
        this.card.style.top   = top + 'px';
        this.card.style.right = '16px';
        this.card.style.left  = 'auto';
        this.card.style.transform = '';
      }, 300);
    } else {
      // وسّط البطاقة إذا لم يُوجد العنصر
      this.card.style.top       = '50%';
      this.card.style.right     = '50%';
      this.card.style.transform = 'translate(50%,-50%)';
    }

    this.card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span style="font-size:11px;color:#9ca3af;font-weight:700;
                     background:#f3f4f6;border-radius:99px;padding:2px 10px;">
          ${index + 1} / ${this.steps.length}
        </span>
        <button id="gmt-tour-skip"
          style="background:none;border:none;color:#9ca3af;cursor:pointer;font-size:18px;line-height:1;">
          ✕
        </button>
      </div>
      <div style="font-size:22px;margin-bottom:8px;">${step.icon || '💡'}</div>
      <div style="font-size:15px;font-weight:900;color:#111827;margin-bottom:8px;">
        ${step.title}
      </div>
      <div style="font-size:13px;color:#374151;line-height:1.7;margin-bottom:16px;">
        ${step.description}
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        ${index > 0 ? `
          <button id="gmt-tour-prev"
            style="background:#f3f4f6;color:#374151;border:none;padding:8px 16px;
                   border-radius:8px;font-family:'Cairo';font-size:12px;font-weight:700;cursor:pointer;">
            ← السابق
          </button>` : ''}
        <button id="gmt-tour-next"
          style="background:#C41230;color:white;border:none;padding:8px 20px;
                 border-radius:8px;font-family:'Cairo';font-size:13px;font-weight:800;cursor:pointer;">
          ${index === this.steps.length - 1 ? '✅ فهمت!' : 'التالي →'}
        </button>
      </div>`;

    document.getElementById('gmt-tour-next')?.addEventListener('click', () => this.next());
    document.getElementById('gmt-tour-prev')?.addEventListener('click', () => this.prev());
    document.getElementById('gmt-tour-skip')?.addEventListener('click', () => this.skip());
  }

  next() {
    this.current++;
    if (this.current >= this.steps.length) this.finish();
    else this._showStep(this.current);
  }

  prev() {
    if (this.current > 0) {
      this.current--;
      this._showStep(this.current);
    }
  }

  skip() {
    if (confirm('هل تريد تخطي الجولة التعليمية؟ يمكنك إعادتها من زر 🎓 في أي وقت.')) {
      this.finish();
    }
  }

  _clearHighlight() {
    document.querySelectorAll('[data-gmt-tour-highlight]').forEach(el => {
      el.style.outline      = '';
      el.style.outlineOffset= '';
      el.style.zIndex       = '';
      delete el.dataset.gmtTourHighlight;
    });
  }

  finish() {
    this._clearHighlight();
    this.overlay?.remove();
    this.card?.remove();
    this.overlay = null;
    this.card    = null;
    localStorage.setItem(this.storageKey, 'true');
  }
}

/* ────────────────────────────────────────────────
   خطوات الجولة لكل ملف
──────────────────────────────────────────────── */

/* نظام الجرد — index_fixed-1.html / index__17_.html */
const GMT_TOUR_INVENTORY = [
  {
    target: '#main-header, #header, .app-header',
    icon: '👋',
    title: 'مرحباً في نظام الجرد GMT',
    description: 'هذا النظام يتيح لك إدارة مخزون كل الفروع، وإنشاء فواتير النقل الداخلي، ومتابعة سجل كل فرع.'
  },
  {
    target: '#search-input, #searchInput, input[placeholder*="بحث"]',
    icon: '🔍',
    title: 'البحث السريع',
    description: 'ابحث عن أي منتج بالاسم أو الباركود. النتائج تظهر فورياً من التخزين المحلي — حتى بدون إنترنت.'
  },
  {
    target: '#mode-btn-inventory, #bnav-inventory',
    icon: '📦',
    title: 'وضع الجرد',
    description: 'عرض كامل للمخزون مع الكميات في كل فرع. يمكن التعديل المباشر أو التصفية حسب الفرع والمجموعة.'
  },
  {
    target: '#mode-btn-bulk, #bnav-bulk',
    icon: '⚡',
    title: 'العمليات الجماعية',
    description: 'تعديل أسعار أو كميات عدة منتجات دفعة واحدة. مفيد جداً للتسعيرة الموسمية.'
  },
  {
    target: '#mode-btn-storelink',
    icon: '🛒',
    title: 'ربط المتجر الإلكتروني',
    description: 'اربط منتجات الجرد بمنتجات المتجر الإلكتروني عبر الباركود. الأسعار تتزامن تلقائياً.'
  },
  {
    target: '#gmt-transfer-tab-btn, .transfer-tab-btn, [onclick*="transfer"]',
    icon: '🚚',
    title: 'نظام النقل الداخلي (جديد)',
    description: 'أنشئ فواتير نقل البضاعة بين الفروع. الكمية تُخصم فوراً من المُرسِل وتُضاف للمستلم عند التأكيد مع صورة التوقيع.'
  },
  {
    target: '#gmt-transfer-badge',
    icon: '🔴',
    title: 'إشعارات النقل',
    description: 'الرقم الأحمر يعني وصلتك فاتورة نقل جديدة — اضغط عليها لمراجعتها وتأكيد الاستلام.'
  },
  {
    target: '#export-btn, [onclick*="export"], [onclick*="Export"]',
    icon: '📤',
    title: 'تصدير البيانات',
    description: 'صدّر قائمة المنتجات إلى Excel للمراجعة، أو احفظ نسخة احتياطية كاملة.'
  }
];

/* لوحة الأدمن — admin-final.html */
const GMT_TOUR_ADMIN = [
  {
    target: '#admin-header, .main-header',
    icon: '🔐',
    title: 'لوحة تحكم الأدمن',
    description: 'هنا تدير الفواتير، العمولات، الموظفين، الكوبونات، والعروض. كل شيء في مكان واحد.'
  },
  {
    target: '[onclick*="invoices"], [onclick*="switchTab(\'invoices\')"]',
    icon: '💰',
    title: 'فواتير المبيع',
    description: 'عرض كل فواتير المبيع من كل الفروع. يمكنك الموافقة على العمولات أو رفضها.'
  },
  {
    target: '#gmt-order-link-btn, [onclick*="linkOrder"]',
    icon: '🔗',
    title: 'ربط فاتورة بأوردر شحن',
    description: 'عند ربط فاتورة بأوردر: السعر يؤخذ من الأوردر تلقائياً، والخصم يحسب وحده، والعمولة تصبح صفراً.'
  },
  {
    target: '[onclick*="transfers"], [onclick*="switchTab(\'transfers\')"]',
    icon: '🚚',
    title: 'إدارة النقل الداخلي',
    description: 'أنشئ فواتير النقل بين الفروع وتابع حالتها، وأكّد الاستلام برفع صورة الفاتورة الموقّعة.'
  },
  {
    target: '[onclick*="commissions"], [onclick*="switchTab(\'commissions\')"]',
    icon: '💸',
    title: 'العمولات',
    description: 'راجع عمولات كل موظف وأقرّها. الفواتير المرتبطة بأوردر لا تحتوي عمولة تلقائياً.'
  },
  {
    target: '[onclick*="offers"], [onclick*="switchTab(\'offers\')"]',
    icon: '🎁',
    title: 'العروض والكوبونات',
    description: 'أنشئ عروض الباقات والكوبونات المخصصة للزبائن. تُطبَّق تلقائياً في نقطة البيع.'
  }
];

/* نظام الأوردرات — orders-final.html */
const GMT_TOUR_ORDERS = [
  {
    target: '#tab-pending',
    icon: '📦',
    title: 'قيد التجهيز',
    description: 'الأوردرات الجديدة التي تحتاج تجهيزاً. عند إنشاء فاتورة بيع مرتبطة بأوردر، ينتقل تلقائياً للمرحلة التالية.'
  },
  {
    target: '#tab-prepared',
    icon: '✅',
    title: 'جاهز للشحن (جديد)',
    description: 'أوردرات أُنشئت فواتيرها — جاهزة للتسليم لشركة الشحن. المبلغ معروف والكمية مُخصومة من المخزون.'
  },
  {
    target: '#tab-shipped',
    icon: '🚚',
    title: 'في الطريق',
    description: 'بضاعة شُحنت وعليها رقم تتبع. يظهر تحذير إذا تأخرت أكثر من 5 أيام.'
  },
  {
    target: '#tab-delivered',
    icon: '📬',
    title: 'بانتظار التحصيل',
    description: 'وصلت البضاعة للزبون — بانتظار قبض المبلغ. هذه الأموال معلقة في صندوقك حتى تضغط "تم التحصيل".'
  },
  {
    target: '#tab-completed',
    icon: '💰',
    title: 'تم التحصيل',
    description: 'المبلغ دخل رسمياً لصندوق نقطة البيع. يظهر في غلتك اليومية ويمكن ترحيله للإدارة.'
  },
  {
    target: '#filter-branch',
    icon: '🏭',
    title: 'فلتر الفرع',
    description: 'تصفية حسب فرع الإرسال. مفيد لمعرفة أموال التحصيل الموجودة مع كل نقطة بيع.'
  }
];

/* ملف المشتريات — purchases-15.html */
const GMT_TOUR_PURCHASES = [
  {
    target: '[onclick*="inv"], .tab-btn, nav button',
    icon: '🌍',
    title: 'فواتير الاستيراد',
    description: 'للبضاعة القادمة من ألمانيا أو الصين. الكمية تُضاف للمخزون عند حفظ الفاتورة.'
  },
  {
    target: 'input[placeholder*="بحث"], input[placeholder*="اسم"]',
    icon: '🔍',
    title: 'إضافة المنتجات',
    description: 'ابحث عن المنتج بالاسم أو الباركود وأضفه للفاتورة مع صورته وسعره.'
  },
  {
    target: '[onclick*="save"], [onclick*="Save"], button[type="submit"]',
    icon: '💾',
    title: 'الحفظ والترحيل',
    description: 'عند الحفظ: الكميات تُضاف للمخزون، وتُرسل إشعار تيليجرام، ويمكن طباعة الفاتورة.'
  }
];

/* ────────────────────────────────────────────────
   دالة التهيئة الرئيسية — تُستدعى من كل ملف
──────────────────────────────────────────────── */
window.gmtInitTour = function(pageId) {
  let steps;
  switch (pageId) {
    case 'inventory': steps = GMT_TOUR_INVENTORY; break;
    case 'admin':     steps = GMT_TOUR_ADMIN;     break;
    case 'orders':    steps = GMT_TOUR_ORDERS;    break;
    case 'purchases': steps = GMT_TOUR_PURCHASES; break;
    default:          steps = [];
  }
  window._gmtTour = new GMTTour(steps, 'tour_done_' + pageId);
  return window._gmtTour;
};

/* زر إعادة الجولة */
window.gmtRestartTour = function() {
  if (window._gmtTour) {
    window._gmtTour.start(true);
  }
};

/* دالة لإضافة زر الجولة في أي مكان */
window.gmtInjectTourButton = function(containerId) {
  const container = containerId ? document.getElementById(containerId) : null;
  if (!container) return;
  const btn = document.createElement('button');
  btn.onclick = window.gmtRestartTour;
  btn.title = 'إعادة الجولة التعليمية';
  btn.style.cssText = [
    'background:#f3f4f6;color:#374151;border:1px solid #e5e7eb;',
    'padding:6px 12px;border-radius:8px;font-family:"Cairo";',
    'font-size:12px;font-weight:700;cursor:pointer;'
  ].join('');
  btn.textContent = '🎓 إعادة الجولة';
  container.appendChild(btn);
};

/* ────────────────────────────────────────────────
   التحقق من الإشعارات (badge للنقل)
──────────────────────────────────────────────── */
window.gmtStartNotificationPolling = function(branchKey, sbUrl, sbKey) {
  if (!branchKey || !sbUrl || !sbKey) return;
  const check = async () => {
    try {
      const r = await fetch(
        `${sbUrl}/rest/v1/branch_notifications?branch_key=eq.${encodeURIComponent(branchKey)}&is_read=eq.false&order=created_at.desc`,
        { headers: { apikey: sbKey, Authorization: 'Bearer ' + sbKey } }
      );
      if (!r.ok) return;
      const notifs = await r.json();
      const badge = document.getElementById('gmt-transfer-badge');
      if (badge) {
        badge.textContent = notifs.length || '';
        badge.style.display = notifs.length > 0 ? 'inline-flex' : 'none';
      }
      if (notifs.length > 0) gmtShowNotifBar(notifs[0]);
    } catch(e) { /* offline — تجاهل */ }
  };
  check();
  return setInterval(check, 60000);
};

window.gmtShowNotifBar = function(notif) {
  if (document.getElementById('gmt-notif-bar')) return;
  const bar = document.createElement('div');
  bar.id = 'gmt-notif-bar';
  bar.style.cssText = [
    'position:fixed;top:60px;left:0;right:0;z-index:9999;',
    'background:#1d4ed8;color:white;padding:12px 16px;',
    'display:flex;align-items:center;gap:12px;flex-wrap:wrap;',
    'font-family:"Cairo",sans-serif;direction:rtl;'
  ].join('');
  bar.innerHTML = `
    <span style="flex:1;font-size:13px;font-weight:700;">🚚 ${notif.message}</span>
    <button onclick="document.getElementById('gmt-notif-bar').remove()"
      style="background:transparent;color:white;border:none;font-size:18px;cursor:pointer;line-height:1;">✕</button>`;
  document.body.appendChild(bar);
  setTimeout(() => bar?.remove(), 12000);
};

console.log('[gmt-tour.js] ✅ تم تحميل البرنامج التعليمي لـ GMT Systems');
