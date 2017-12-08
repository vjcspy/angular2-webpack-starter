export class ReportDashboardHelper {
  static NEXT_GRANULARITY = 1;
  static PREV_GRANULARITY = -1;
  
  static getValueNextPrevGranularity(code) {
    switch (code) {
      case 'next':
        return ReportDashboardHelper.NEXT_GRANULARITY;
      case 'prev':
        return ReportDashboardHelper.PREV_GRANULARITY;
      default:
        return 0;
    }
  }
  
  static getListScope(): Object {
    return {
      data: [
        {id: 1, label: "Outlet", value: "outlet"},
        {id: 2, label: "Magento Website", value: "website"},
        {id: 3, label: "Magento Storeview", value: "store"}
      ],
      isMultiSelect: false,
      label: "Scope",
      value: "scope"
    };
  }
  
  static getWidgets(): Object {
    return {
      data: [
        {id: 1, label: "Revenue", value: "revenue"},
        {id: 2, label: "Order Count", value: "quantity"},
        {id: 3, label: "Average Sales", value: "average_sales"},
        {id: 4, label: "Customer Count", value: "customer_count"},
        {id: 5, label: "Discount", value: "discount"},
        {id: 6, label: "Discount Percent", value: "discount_percent"}
      ],
      isMultiSelect: false,
      label: "Widgets",
      value: "widgets"
    }
  }
  
  static getListTimePeriodPicker(): Object {
    return {
      data: [
        {id: 1, label: "Day", value: "7d"},
        {id: 2, label: "Week", value: "6w"},
        {id: 3, label: "Month", value: "6m"}
      ],
      isMultiSelect: false,
      label: "Time Period Picker",
      value: "time_period_picker"
    };
  }
}
