chrome.devtools.panels.create("Sample Panel", null, "panel.html");
chrome.devtools.panels.elements.createSidebarPane(
  "My Sidebar",
  function (sidebar) {
    // sidebar initialization code here
    sidebar.setObject({ some_data: "Some data to show" });
  }
);
