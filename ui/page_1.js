export function Container1(doc, fields) {
  return new Promise((resolve) => {
    // Initial settings
    const leftMargin = 25.7;
    const rightMargin = 17.5;
    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = pageWidth - (leftMargin + rightMargin);
    let yPosition = 10;

    // Add logo on the right side
    const img = new Image();
    img.src = "images/logo.png";

    img.onload = function () {
      // Logo dimensions
      const logoWidth = 30;
      const logoHeight = 30;
      const logoX = pageWidth - rightMargin - logoWidth - 6;
      yPosition += 2;
      doc.addImage(img, "PNG", logoX, yPosition, logoWidth, logoHeight);

      // Draw the main outer box
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.rect(leftMargin, yPosition, tableWidth, pageHeight - 45);

      // Company header
      doc.setFontSize(16);
      doc.setTextColor(65, 105, 225);
      doc.setFont("helvetica", "bold");
      doc.text("TRUE PEAK HOUSE LLP", leftMargin + 2, yPosition + 10);

      // Company details
      yPosition += 15;
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const address =
        "GSTIN: 29AAUFT3926A1ZW, #240/C, FIRST FLOOR, 3RD BLOCK, NAGARABHAVI 2ND STAGE,";
      doc.text(address, leftMargin + 2, yPosition);

      // Contact details
      yPosition += 5;
      const contact =
        "Bengaluru: 560072. MOB: +91 9743142447 | balakrishna@truepeak.in | www.truepeak.in";
      doc.text(contact, leftMargin + 2, yPosition);
      doc.setTextColor(0, 0, 255); // Blue #0000FF

      // Draw a line below the title
      doc.setLineWidth(0.5);
      yPosition += 9;
      doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);

      // Bank details
      doc.setTextColor(0, 0, 0);
      //yPosition += 2;
      doc.setFont("helvetica", "normal");
      doc.text("To,", leftMargin + 2, yPosition + 4);
      doc.setFont("times", "bold");
      doc.text(
        fields.managerDesignation?.value.toUpperCase() || "",
        leftMargin + 2,
        yPosition + 8
      );
      doc.text(
        fields.bankName?.value.toUpperCase() || "",
        leftMargin + 2,
        yPosition + 12
      );
      doc.text(
        fields.branchLocation?.value.toUpperCase() || "",
        leftMargin + 2,
        yPosition + 16
      );

      // Title section
      yPosition += 20;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);

      // Centered title
      doc.text(
        "VALUATION REPORT - IMMOVABLE PROPERTY",
        pageWidth / 2,
        yPosition + 5.5,
        { align: "center" }
      );

      // Get text width to align underline properly
      let textWidth = doc.getTextWidth("VALUATION REPORT - IMMOVABLE PROPERTY");
      let textX = (pageWidth - textWidth) / 2; // Centering the underline

      // Draw underline
      doc.line(textX, yPosition + 6, textX + textWidth, yPosition + 6); // Adjust `+7` for spacing

      // Create table instance
      yPosition += 5;
      let table = createTable(
        doc,
        yPosition,
        null,
        "Type of Property –" + fields.propertyTypeHeader?.value || ""
      );
      let yPos = table.getPosition();

      doc.setFontSize(8);

      // Purpose of Valuation
      yPos = table.addSplitColumnRow("1", "Purpose of Valuation", [
        "Purpose",
        "Type",
        "Banks Purpose",
        "Construction Loan",
      ]);

      // Accompanying Person
      yPos = table.addRow(
        "2",
        "Name of Customer (s)/ Borrower unit (for which valuation report is sought) ",
        fields.name_of_borrower?.value || ""
      );

      // Customer Details
      yPos = table.addRow("3", "Customer Details", "", null, true);
      yPos = table.addRow(
        "a",
        fields.customerName?.label || "",
        fields.customerName?.value || ""
      );
      // Accompanying Person
      yPos = table.addRow(
        "b",
        fields.person_accompanying_contact_no?.label || "",
        fields.person_accompanying_contact_no?.value || ""
      );
      yPos = table.addRow(
        "c",
        fields.name_of_purchaser?.label || "",
        fields.name_of_purchaser?.value || ""
      );
      yPos = table.addRow(
        "d",
        fields.application_no?.label || "",
        fields.application_no?.value || ""
      );

      // Property Details with Address Array
      yPos = table.addRow("4", "Property Details", "", null, true);
      yPos = table.addAddressRow("a", "Address", fields.address?.value || "");

      yPos = table.addRow(
        "b",
        fields.nearby_landmark?.label || "",
        fields.nearby_landmark?.value || ""
      );

      // Document Details
      yPos = table.addRow("5", "Document Details", "", null, true);

      //Layout Plan
      yPos = table.addRow("a", "Layout Plan", null, true);
      yPos = table.addRow(
        "i)",
        fields.lp_yesNo?.label || "",
        fields.lp_yesNo?.label || ""
      );
      yPos = table.addRow(
        "ii)",
        fields.lp_name_of_approving_authority?.label || "",
        fields.lp_name_of_approving_authority?.value || ""
      );
      yPos = table.addRow(
        "iii)",
        fields.lp_approval_no_details?.label || "",
        fields.lp_approval_no_details?.value || ""
      );

      //Building Plan
      yPos = table.addRow("b", "Building Plan", null, true);
      yPos = table.addRow(
        "i)",
        fields.bp_yesNo?.label || "",
        fields.bp_yesNo?.value || ""
      );
      yPos = table.addRow(
        "ii)",
        fields.bp_name_of_approving_authority?.label || "",
        fields.bp_name_of_approving_authority?.value || ""
      );
      yPos = table.addRow(
        "iii)",
        fields.bp_approval_no_details?.label || "",
        fields.bp_approval_no_details?.value || ""
      );

      yPos = table.addRow(
        "c",
        fields.legalDocuments?.label || "",
        fields.legalDocuments?.value || ""
      );

      // Add Physical Details section
      yPos = table.addRow("6", "Physical Details", "", null, true);

      // Add header row
      yPos = table.addAdjoiningPropertiesRow(
        "a",
        "Adjoining Properties:",
        "As per Document",
        "As per Actuals"
      );

      // Add direction rows
      yPos = table.addAdjoiningPropertiesRow(
        "i",
        "East",
        fields.eastBoundaryDoc?.value || "",
        fields.eastBoundaryActual?.value || ""
      );
      yPos = table.addAdjoiningPropertiesRow(
        "ii",
        "West",
        fields.westBoundaryDoc?.value || "",
        fields.westBoundaryActual?.value || ""
      );
      yPos = table.addAdjoiningPropertiesRow(
        "iii",
        "North",
        fields.northBoundaryDoc?.value || "",
        fields.northBoundaryActual?.value || ""
      );
      yPos = table.addAdjoiningPropertiesRow(
        "iv",
        "South",
        fields.southBoundaryDoc?.value || "",
        fields.southBoundaryActual?.value || ""
      );
      yPos = table.addRow(
        "b",
        fields.boundaryMatch?.label || "",
        fields.boundaryMatch?.value || ""
      );
      yPos = table.addRow(
        "c",
        fields.plotDemarcation?.label || "",
        fields.plotDemarcation?.value || ""
      );
      yPos = table.addRow(
        "d)",
        fields.landUse?.label || "",
        fields.landUse?.value || ""
      );
      yPos = table.addRow(
        "e)",
        fields.propertyType?.label || "",
        fields.propertyType?.value || ""
      );

      resolve(yPos);
    };

    img.onerror = function () {
      console.error("Error loading logo");
      resolve(yPos);
    };
  });
}

// Update the createTable function to accept null title/subtitle
// Update the createTable function to accept null title/subtitle
function createTable(doc, startY, title, subtitle = null) {
  let yPosition = startY;
  const pageWidth = doc.internal.pageSize.getWidth();
  const leftMargin = 25.7;
  const rightMargin = 17.5;
  const tableWidth = pageWidth - (leftMargin + rightMargin);

  if (subtitle) {
    yPosition += 5;
    doc.rect(leftMargin, yPosition, tableWidth, 8);
    doc.setFontSize(9);
    doc.text(subtitle, pageWidth / 2, yPosition + 5.5, { align: "center" });
    yPosition += 8;
  }

  const col1Width = 7;
  const col2Width = 85;
  const col3Width = tableWidth - col1Width - col2Width;

  function addAddressRow(number, description, address) {
    const lineHeight = 3.1;
    const padding = 4; // Extra padding for readability

    // Split text for wrapping within column widths
    const splitAddress = doc.splitTextToSize(address, col3Width - 6);
    const splitDescription = doc.splitTextToSize(description, col2Width - 6);

    // Find the max number of lines needed for any column
    const maxLines = Math.max(splitAddress.length, splitDescription.length, 1);

    // Calculate dynamic row height
    const rowHeight = maxLines * lineHeight + padding;

    // Draw table row with dynamic height
    doc.rect(leftMargin, yPosition, col1Width, rowHeight); // Column 1 (Number)
    doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight); // Column 2 (Description)
    doc.rect(
      leftMargin + col1Width + col2Width,
      yPosition,
      col3Width,
      rowHeight
    ); // Column 3 (Address)

    // Add text to each column
    doc.setFont("helvetica", "normal");
    doc.text(number.toString(), leftMargin + 2, yPosition + 4);
    doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 4);
    doc.text(
      splitAddress,
      leftMargin + col1Width + col2Width + 2,
      yPosition + 4
    );

    // Move Y position for the next row
    yPosition += rowHeight;
  }

  function addAdjoiningPropertiesRow(
    number,
    description,
    docValue,
    actualValue
  ) {
    // Set font size consistently and calculate widths
    doc.setFontSize(8);
    const col1Width = 7;
    const col2Width = 85;
    const remainingWidth = tableWidth - col1Width - col2Width;
    const col3Width = remainingWidth / 2; // Split remaining width into two equal parts
    const col4Width = remainingWidth / 2;

    // Calculate text heights for auto-adjustment
    const splitDescription = doc.splitTextToSize(description, col2Width - 4);
    const splitDocValue = doc.splitTextToSize(docValue, col3Width - 4);
    const splitActualValue = doc.splitTextToSize(actualValue, col4Width - 4);

    // Calculate max lines for height
    const descriptionLines = splitDescription.length;
    const docValueLines = splitDocValue.length;
    const actualValueLines = splitActualValue.length;
    const maxLines = Math.max(
      descriptionLines,
      docValueLines,
      actualValueLines
    );

    // Calculate height
    const lineHeight = 3.1;
    const padding = 2;
    const rowHeight = maxLines * lineHeight + padding * 2;

    // Draw columns
    doc.rect(leftMargin, yPosition, col1Width, rowHeight);
    doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight);
    doc.rect(
      leftMargin + col1Width + col2Width,
      yPosition,
      col3Width,
      rowHeight
    );
    doc.rect(
      leftMargin + col1Width + col2Width + col3Width,
      yPosition,
      col4Width,
      rowHeight
    );

    // Add text
    doc.setFont("helvetica", "normal");
    if (number) {
      doc.text(number.toString(), leftMargin + 2, yPosition + 4);
    }

    // Add description
    doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 4);

    // Add document value and actual value with conditional bold
    if (docValue === "As per Document" && actualValue === "As per Actuals") {
      // Make headers bold
      doc.setFont("helvetica", "bold");
      doc.text(
        splitDocValue,
        leftMargin + col1Width + col2Width + 2,
        yPosition + 4
      );
      doc.text(
        splitActualValue,
        leftMargin + col1Width + col2Width + col3Width + 2,
        yPosition + 4
      );
    } else {
      // Normal text for other rows
      doc.setFont("helvetica", "normal");
      doc.text(
        splitDocValue,
        leftMargin + col1Width + col2Width + 2,
        yPosition + 4
      );
      doc.text(
        splitActualValue,
        leftMargin + col1Width + col2Width + col3Width + 2,
        yPosition + 4
      );
    }

    yPosition += rowHeight;
    return yPosition;
  }

  function addSplitColumnRow(
    number,
    description,
    col3Texts = [
      "Own Purpose",
      "CAPITAL GAINS",
      "Banks Purpose",
      "Construction Loan",
    ]
  ) {
    // Set font size consistently and calculate widths

    const col1Width = 7;
    const col2Width = 85;
    const col3Width = tableWidth - col1Width - col2Width;
    const col3SplitWidth = col3Width / 2; // Split into 2 equal columns for grid

    // Helper function to calculate lines for a text within a width
    const getTextLines = (text, width) => {
      return doc.splitTextToSize(text, width - 6).length;
    };

    // Calculate required height only for bottom row in the grid
    const bottomRowLines = Math.max(
      getTextLines(col3Texts[2], col3SplitWidth),
      getTextLines(col3Texts[3], col3SplitWidth)
    );

    // Calculate description lines
    const descriptionSplit = doc.splitTextToSize(description, col2Width - 6);
    const descriptionLines = descriptionSplit.length;

    // Calculate row heights
    const lineHeight = 2.5;
    const padding = 2;
    const topRowHeight = lineHeight + padding * 2; // Fixed height for top row
    const bottomRowHeight = bottomRowLines * lineHeight + padding * 2;
    const descriptionHeight = descriptionLines * lineHeight + padding * 2;

    // Total height should be maximum of description or sum of grid rows
    const rowHeight = Math.max(
      descriptionHeight,
      topRowHeight + bottomRowHeight
    );

    // Draw main columns
    doc.rect(leftMargin, yPosition, col1Width, rowHeight);
    doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight);

    // Draw grid in third column
    const col3Start = leftMargin + col1Width + col2Width;

    // Draw grid cells with fixed height for top row
    doc.rect(col3Start, yPosition, col3SplitWidth, topRowHeight);
    doc.rect(
      col3Start + col3SplitWidth,
      yPosition,
      col3SplitWidth,
      topRowHeight
    );
    doc.rect(
      col3Start,
      yPosition + topRowHeight,
      col3SplitWidth,
      rowHeight - topRowHeight
    );
    doc.rect(
      col3Start + col3SplitWidth,
      yPosition + topRowHeight,
      col3SplitWidth,
      rowHeight - topRowHeight
    );

    // Add text content with proper wrapping
    doc.setFont("helvetica", "normal");
    doc.text(number.toString(), leftMargin + 2, yPosition + 4);
    doc.text(descriptionSplit, leftMargin + col1Width + 2, yPosition + 4);

    // Helper function to add wrapped text
    const addWrappedText = (text, x, y, width) => {
      const splitText = doc.splitTextToSize(text, width - 6);
      doc.text(splitText, x, y);
    };

    // Add grid cell text - top row with fixed text
    doc.setFont("helvetica", "bold");
    doc.text(col3Texts[0], col3Start + 2, yPosition + 4);
    doc.text(col3Texts[1], col3Start + col3SplitWidth + 2, yPosition + 4);

    // Bottom row with auto-wrapped text
    doc.setFont("helvetica", "normal");
    addWrappedText(
      col3Texts[2],
      col3Start + 2,
      yPosition + topRowHeight + 4,
      col3SplitWidth
    );
    addWrappedText(
      col3Texts[3],
      col3Start + col3SplitWidth + 2,
      yPosition + topRowHeight + 4,
      col3SplitWidth
    );

    yPosition += rowHeight;
    return yPosition;
  }

  function addRow(
    number,
    description,
    value,
    height = null,
    no_column = false
  ) {
    // Set font size consistently

    // Calculate text length
    const textLength = description.length + (value ? value.length : 0);

    // Split text for measurement
    const splitDescription = doc.splitTextToSize(description, col2Width - 4);
    const splitValue = value ? doc.splitTextToSize(value, col3Width - 4) : [""];

    // Get number of lines for both description and value
    const descriptionLines = splitDescription.length;
    const valueLines = splitValue.length;

    // Use the maximum number of lines to determine height
    const maxLines = Math.max(descriptionLines, valueLines);
    const lineHeight = 3.1; // Reduced base height per line
    const padding = 2; // Minimum padding

    // Calculate height based on content
    let calculatedHeight;
    if (maxLines === 1) {
      calculatedHeight = lineHeight + padding; // Minimum height for single line
    } else {
      calculatedHeight = maxLines * lineHeight + padding; // Height for multiple lines
    }

    // If height parameter is provided, use it as minimum height
    const rowHeight = height
      ? Math.max(calculatedHeight, height)
      : calculatedHeight;

    if (no_column) {
      // Draw only two columns when no_column is true
      doc.rect(leftMargin, yPosition, col1Width, rowHeight);

      if (number) {
        doc.setFont("helvetica", "normal");
        doc.text(number.toString(), leftMargin + 1, yPosition + 3);
        doc.rect(
          leftMargin + col1Width,
          yPosition,
          col2Width + col3Width,
          rowHeight
        );
      }

      // Set bold font for description when no_column is true
      doc.setFont("helvetica", "bold");
      doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 3);
    } else {
      // Original three-column layout
      doc.rect(leftMargin, yPosition, col1Width, rowHeight);
      doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight);
      doc.rect(
        leftMargin + col1Width + col2Width,
        yPosition,
        col3Width,
        rowHeight
      );

      if (number) {
        doc.setFont("helvetica", "normal");
        doc.text(number.toString(), leftMargin + 2, yPosition + 3);
      }

      doc.setFont("helvetica", "normal");
      doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 3);

      if (value && value.includes("Mrs")) {
        doc.setFont("helvetica", "bold");
      }
      doc.text(
        splitValue,
        leftMargin + col1Width + col2Width + 2,
        yPosition + 3
      );
    }

    yPosition += rowHeight;
    return yPosition;
  }

  return {
    addRow,
    addSplitColumnRow,
    addAddressRow,
    addAdjoiningPropertiesRow,
    getPosition: () => yPosition,
  };
}

function addFooter(doc) {
  const leftMargin = 25.7;
  const rightMargin = 17.5;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  // Add horizontal line at the bottom
  const footerY = pageHeight - 28.7;
  doc.setLineWidth(0.1);
  //doc.line(leftMargin, footerY, pageWidth - rightMargin, footerY);

  // Page number on right
  doc.text("Page 2", pageWidth - rightMargin - 40, footerY);
  doc.text("Ref No.", pageWidth - rightMargin - 40, footerY + 3);
  // Reference number
  doc.text(
    "TP/JCB/K-BKR/R-09/12/2024-25",
    pageWidth - rightMargin - 40,
    footerY + 6
  );
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
}
