function Container2(doc) {
  const Container_2 = JSON.parse(localStorage.getItem("Container_2") || "{}");
  const leftMargin = 25.7;
  const rightMargin = 17.5;
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 0;

  const img = new Image();
  img.src = "images/logo.png";

  return new Promise((resolve) => {
    img.onload = function () {
      const logoWidth = 30;
      const logoHeight = 30;
      const logoX = pageWidth - rightMargin - logoWidth - 6;
      yPosition += 2;
      doc.addImage(img, "PNG", logoX, yPosition, logoWidth, logoHeight);

      yPosition += logoHeight + 2;
      doc.setFontSize(8);

      const table = createTable(doc, yPosition, "", "");
      let yPos = table.getPosition();

      // Section 6
      yPos = table.addAdjoiningPropertiesRow(
        "f",
        "Details of Accommodations:",
        "Floor",
        "Usage",
        true
      );
      (Container_2.accommodationDetails || []).forEach((item) => {
        yPos = table.addAdjoiningPropertiesRow(
          "",
          "",
          item.floor,
          item.usage || "-"
        );
      });

      yPos = table.addAdjoiningPropertiesRow(
        "g",
        "Total No of Floors:",
        "As per Plan",
        "As per Actuals",
        true
      );
      yPos = table.addAdjoiningPropertiesRow(
        "",
        "",
        Container_2.totalFloors?.asPerPlan || "-",
        Container_2.totalFloors?.asPerActual || "-"
      );

      yPos = table.addRow(
        "h",
        "Floor on which the property is located",
        Container_2.propertyFloor || "-"
      );
      yPos = table.addRow(
        "i",
        "Year of construction",
        Container_2.constructionYear || "-"
      );
      yPos = table.addRow(
        "j",
        "Approx. age of the Property",
        Container_2.propertyAge || "-"
      );
      yPos = table.addRow(
        "k",
        "Residual age of the Property",
        Container_2.residualAge || "-"
      );
      yPos = table.addRow(
        "l",
        "Type of structure",
        Container_2.structureType || "-"
      );
      yPos = table.addRow(
        "",
        "Amenities provided",
        Container_2.amenities || "-"
      );

      // Section 7
      yPos = table.addRow("7", "Tenure / Occupancy Details", "", 6, true);
      yPos = table.addRow("", "Status of Tenure", "", 6, true);
      yPos = table.addRow(
        "i",
        "Owned / Rented",
        Container_2.ownedOrRented || "-"
      );
      yPos = table.addRow(
        "ii",
        "No. of years of Occupancy",
        Container_2.occupancyYears || "-"
      );
      yPos = table.addRow(
        "iii",
        "Relationship of tenant or owner",
        Container_2.relationOfTenant || "-"
      );

      // Section 8
      yPos = table.addRow("8", "Building Status", "", 6, true);
      yPos = table.addRow(
        "i",
        "Existing building",
        Container_2.existingBuilding || "-"
      );
      yPos = table.addRow(
        "ii",
        "Stage of construction",
        Container_2.constructionStage || "-"
      );
      yPos = table.addRow(
        "iii",
        "Extent of completion",
        Container_2.workCompletion || "-"
      );

      // Section 9
      yPos = table.addRow("9", "Violations if any observed", "", 6, true);
      yPos = table.addRow(
        "i",
        "Nature and extent of violations",
        Container_2.violations || "-"
      );

      // Section 10: Area Details
      yPos = table.addRow("10", "Area Details of the Property", "", 6, true);
      yPos = table.addAdjoiningPropertiesRow(
        "i",
        "East to West",
        Container_2.siteAreaDetails?.asPerDocument?.eastToWest || "-",
        Container_2.siteAreaDetails?.asPerActual?.eastToWest || "-"
      );
      yPos = table.addAdjoiningPropertiesRow(
        "",
        "North to South",
        Container_2.siteAreaDetails?.asPerDocument?.northToSouth || "-",
        Container_2.siteAreaDetails?.asPerActual?.northToSouth || "-"
      );
      yPos = table.addAdjoiningPropertiesRow(
        "",
        "Totally Measuring",
        Container_2.siteAreaDetails?.asPerDocument?.totallyMeasuring || "-",
        Container_2.siteAreaDetails?.asPerActual?.totallyMeasuring || "-"
      );

      yPos = table.addRow("ii", "Plinth area", Container_2.plinthArea || "-");
      yPos = table.addRow("iii", "Carpet area", Container_2.carpetArea || "-");
      yPos = table.addRow(
        "iv",
        "Saleable area",
        Container_2.saleableArea || "-"
      );
      yPos = table.addRow("v", "Remarks", Container_2.remarks || "-");

      // Section 11
      yPos = table.addRow("11", "Valuation Note", "", 6, true);
      yPos = table.addRow(
        "a (i)",
        "Govt Approved Value",
        Container_2.govtValue || "-"
      );
      yPos = table.addRow(
        "ii",
        "Justification for valuation variation (if > 20%)",
        Container_2.variationJustification || "-"
      );

      yPos = table.addRow("b", "Summary of Valuation", "", 6, true);
      yPos = table.addRow(
        "i",
        "Guideline Rate",
        Container_2.guidelineRate || "-"
      );
      yPos = table.addRow("ii", "Market Rate", Container_2.marketRate || "-");
      yPos = table.addRow("iii", "Land Value", Container_2.landValue || "-");
      yPos = table.addRow(
        "iv",
        "Building Value",
        Container_2.buildingValue || "-"
      );
      yPos = table.addRow(
        "v",
        "Extra Items, Amenities & Services",
        Container_2.extraItems || "-"
      );
      yPos = table.addRow(
        "vi",
        "Fair Market Value (SAY)",
        Container_2.fairMarketValue || "-"
      );
      yPos = table.addRow(
        "vii",
        "Realizable Value @ 90%",
        Container_2.realizableValue || "-"
      );
      yPos = table.addRow(
        "viii",
        "Forced Distressed Sale Value",
        Container_2.forcedDistressedSaleValue || "-"
      );
      yPos = table.addRow(
        "ix",
        "Expected Rental Value",
        Container_2.rentalValue || "-"
      );

      resolve(yPos);
    };

    img.onerror = function () {
      console.error("Error loading logo");
      resolve(yPosition);
    };
  });
}

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

  function addRow(
    number,
    description,
    value,
    height = null,
    no_column = false
  ) {
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
    const padding = 1; // Minimum padding

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
        doc.text(number.toString(), leftMargin + 1, yPosition + 4);
        doc.rect(
          leftMargin + col1Width,
          yPosition,
          col2Width + col3Width,
          rowHeight
        );
      }

      // Set bold font for description when no_column is true
      doc.setFont("helvetica", "bold");
      doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 4);
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

      doc.text(
        splitValue,
        leftMargin + col1Width + col2Width + 2,
        yPosition + 3
      );
    }

    yPosition += rowHeight;
    return yPosition;
  }

  function addAdjoiningPropertiesRow(
    number,
    description,
    docValue,
    actualValue,
    bold = false,
    height = null
  ) {
    doc.setFontSize(8);

    const col1Width = 7;
    const col2Width = 85;
    const remainingWidth = tableWidth - col1Width - col2Width;
    const col3Width = remainingWidth / 2;
    const col4Width = remainingWidth / 2;

    // Split text for line measurement
    const splitDescription = doc.splitTextToSize(description, col2Width - 4);
    const splitDocValue = doc.splitTextToSize(docValue, col3Width - 4);
    const splitActualValue = doc.splitTextToSize(actualValue, col4Width - 4);

    // Line counts
    const descriptionLines = splitDescription.length;
    const docValueLines = splitDocValue.length;
    const actualValueLines = splitActualValue.length;

    const maxLines = Math.max(
      descriptionLines,
      docValueLines,
      actualValueLines
    );

    // Height logic
    const lineHeight = 3.1;
    const padding = 1;
    let calculatedHeight;

    if (maxLines === 1) {
      calculatedHeight = lineHeight + padding * 2;
    } else {
      calculatedHeight = maxLines * lineHeight + padding * 2;
    }

    const rowHeight = height
      ? Math.max(calculatedHeight, height)
      : calculatedHeight;

    // Draw cell boxes
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

    // Set font style
    if (bold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }

    // Text alignment
    const textTop = yPosition + 3;

    // Draw content
    if (number) doc.text(number.toString(), leftMargin + 2, textTop);

    doc.text(splitDescription, leftMargin + col1Width + 2, textTop);
    doc.text(splitDocValue, leftMargin + col1Width + col2Width + 2, textTop);
    doc.text(
      splitActualValue,
      leftMargin + col1Width + col2Width + col3Width + 2,
      textTop
    );

    yPosition += rowHeight;
    return yPosition;
  }

  return {
    addRow,
    addAdjoiningPropertiesRow,
    addAddressRow,
    getPosition: () => yPosition,
  };
}
function addFooter(doc) {
  const margin = 10;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add horizontal line at the bottom
  const footerY = pageHeight - 20;
  doc.setLineWidth(0.1);
  doc.line(margin, footerY + 4, pageWidth - margin, footerY + 4);

  // Add the chartered engineers text
  doc.setFontSize(9);
  doc.setTextColor(65, 105, 225); // Blue color
  doc.setFont("helvetica", "bold");
  doc.text(
    "CHARTERED ENGINEERS | STRUCTURAL CONSULTANTS | N.D.T | R&R | VALUATION OF IMMOVABLE PROPERTIES.",
    pageWidth / 2,
    footerY + 9,
    { align: "center" }
  );

  // Add reference number and page number on next line
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0); // Reset back to black for subsequent text
  // Reference number on left
  doc.text("TP/JCB/K-BKR/R-09/12/2024-25", margin + 5, footerY + 15);
  // Page number on right
  doc.text("Page 1", pageWidth - margin - 20, footerY + 15);
}

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  await Container2(doc, Container_2);
  addFooter(doc);
  doc.save("auto-adjustment-pg-2.pdf");
  return doc;
}
