$(function () {
  // 設定日期格式
  var dateFormat = 'yy/mm/dd',
    // 設定開始日曆
    from = $('#from')
      .datepicker({
        // 顯示小日曆icon：顯示icon、檔案位置、不要按鈕底色、hover顯示字樣
        showOn: 'button',
        buttonImage: '../assets/image/backend/calendar.gif',
        buttonImageOnly: true,
        buttonText: 'Select date',
        // 設定日期格式：年月日
        dateFormat: 'yy/mm/dd',
        // 預設顯示日期：今天
        defaultDate: 'today',
        // 更換月份的下拉選單：是
        changeMonth: true,
        // 顯示月份數量：1個月
        numberOfMonths: 1,
        // 顯示底部的按鈕（今天／關閉）：是
        showButtonPanel: true,
      })
      // 當確定開始時間，結束時間日曆上的最早日期為開始時間
      .on('change', function () {
        to.datepicker('option', 'minDate', getDate(this));
      });

  // 設定結束日曆
  to = $('#to')
    .datepicker({
      showOn: 'button',
      buttonImage: 'assets/image/backend/calendar.gif',
      buttonImageOnly: true,
      buttonText: 'Select date',
      dateFormat: 'yy/mm/dd',
      defaultDate: 'today',
      changeMonth: true,
      numberOfMonths: 1,
      showButtonPanel: true,
    })
    .on('change', function () {
      from.datepicker('option', 'maxDate', getDate(this));
    });

  // 不清楚這個是要做什麼（這個是從source code上複製過來的）
  function getDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }
    return date;
  }
});

var thisJSON;

// 用ajax接外部json檔案，取得後執行renderJSON()
$.ajax({
  dataType: 'json',
  method: 'GET',
  url: 'assets/json/Backend.json',
  data: '',
  success: function (data) {
    // 資料載入再套DataTables，才不會顯示資料沒有進去
    renderJSON(data);
    jQueryDataTable(data);
    // 用變數把資料傳出來
    thisJSON = data;
    return thisJSON;
  },
});

// 在表格中印出資料
function renderJSON(data) {
  var tableHTML = `
  <table id="table_id" class="compact hover">
    <thead>
      <tr>
        <td>ID</td>
        <td>統計圖</td>
        <td>是否顯示</td>
        <td>動作</td>
      </tr>
    </thead>
    <tbody id="BackendData"></tbody>
  </table>`;
  $('.table_container').append(tableHTML);

  for (i = 0; i < data.length; i++) {
    var HTML = `
    <tr>
      <td>${data[i].rowId}</td>
      <td>${data[i].chartName}</td>
      <td>${data[i].isShowName}</td>
      <td><button>編輯</button><br><button>刪除</button></td>
    </tr>>`;
    $('#BackendData').append(HTML);
  }
}

// 套用 jQuery DataTable 樣式
function jQueryDataTable() {
  $('#table_id').DataTable({
    language: {
      url: 'assets/json/zh-HANT.json',
    },
    stripeClasses: ['stripe-1', 'stripe-2'],
    lengthChange: false,
    searching: false,
    lengthMenu: [7],
    pagingType: 'full_numbers',
  });
}

// 點擊新增時，跳出視窗
function showPopUp() {
  $('.popUp').css('display', 'block');
}

// 新增資料
function saveNewData() {
  // 下拉選單資料驗證
  if ($('select[name=popUp_chart]').val() == undefined) {
    $('#popUpChartLabel').addClass('required');
  } else {
    $('#popUpChartLabel').removeClass('required');
  }

  // Radio資料驗證
  if ($('input[name="show"]:checked').val() == undefined) {
    $('#popUpRadioLabel').addClass('required');
  } else {
    $('#popUpRadioLabel').removeClass('required');
  }

  // 如果都有填資料，將資料 push 進原本的JSON裡面，重新 render 一次表格
  if (
    $('select[name=popUp_chart]').val() !== undefined &&
    $('input[name="show"]:checked').val() !== undefined
  ) {
    newData = {
      rowId: (thisJSON.length + 1).toString(),
      dataId: (thisJSON.length + 1).toString(),
      chartId: $('select[name=popUp_chart] option:selected').val(),
      chartName: $('select[name=popUp_chart] option:selected').text(),
      isShow: $('input[name="show"]:checked').val(),
      isShowName: $('input[name="show"]:checked').attr('isShowName'),
    };
    thisJSON.unshift(newData);
    $('.table_container').html('');
    renderJSON(thisJSON);
    jQueryDataTable(thisJSON);
    $('.popUp').css('display', 'none');
  }
}

// 點擊取消時，關掉視窗；資料驗證的醒目文字也關掉
function closePopUp() {
  $('.popUp').css('display', 'none');
  $('#popUpChartLabel').removeClass('required');
  $('#popUpRadioLabel').removeClass('required');
}
