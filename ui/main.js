
// Ensure the script runs only after all other scripts have loaded
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generatePdfBtn").addEventListener("click", async function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        try {
            // Load data from localStorage for all containers
            const containers = [
                { func: Container1, data: JSON.parse(localStorage.getItem('Container_1')) },
                { func: Container2, data: JSON.parse(localStorage.getItem('Container_2')) },
                { func: Container3, data: JSON.parse(localStorage.getItem('Container_3')) },
                { func: Container4, data: JSON.parse(localStorage.getItem('Container_4')) },
                { func: Container5, data: JSON.parse(localStorage.getItem('Container_5')) },
                { func: Container6, data: JSON.parse(localStorage.getItem('Container_6')) },
                { func: Container7, data: JSON.parse(localStorage.getItem('imagesData')) }
            ];

            // Generate each section and add a page after each (except the last one)
            for (let i = 0; i < containers.length; i++) {
                const { func, data } = containers[i];

                if (data) {
                    console.log(`Processing Page ${i + 1}`);
                    await func(doc, data);
                } else {
                    console.warn(`Skipping Page ${i + 1}, no data found.`);
                }

                // Add footer for the current page
                addFooter(doc);
                if (i < containers.length - 1) {
                    doc.addPage(); // Add new page except after the last one
                }
            }

            // Add footer on the last page
            addFooter(doc);

            // Save the complete PDF
            doc.save("Full_Report.pdf");

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    });
});


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
        doc.text(subtitle, pageWidth / 2, yPosition + 5.5, { align: 'center' });
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
    const rowHeight = (maxLines * lineHeight) + padding;

    // Draw table row with dynamic height
    doc.rect(leftMargin, yPosition, col1Width, rowHeight); // Column 1 (Number)
    doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight); // Column 2 (Description)
    doc.rect(leftMargin + col1Width + col2Width, yPosition, col3Width, rowHeight); // Column 3 (Address)

    // Add text to each column
    doc.setFont('helvetica', 'normal');
    doc.text(number.toString(), leftMargin + 2, yPosition + 4);
    doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 4);
    doc.text(splitAddress, leftMargin + col1Width + col2Width + 2, yPosition + 4);

    // Move Y position for the next row
    yPosition += rowHeight;
}

function addAdjoiningPropertiesRow(number, description, docValue, actualValue) {
    // Set font size consistently and calculate widths
    doc.setFontSize(8);
    const col1Width = 7;
    const col2Width = 85;
    const remainingWidth = tableWidth - col1Width - col2Width;
    const col3Width = remainingWidth / 2;  // Split remaining width into two equal parts
    const col4Width = remainingWidth / 2;

    // Calculate text heights for auto-adjustment
    const splitDescription = doc.splitTextToSize(description, col2Width - 4);
    const splitDocValue = doc.splitTextToSize(docValue, col3Width - 4);
    const splitActualValue = doc.splitTextToSize(actualValue, col4Width - 4);

    // Calculate max lines for height
    const descriptionLines = splitDescription.length;
    const docValueLines = splitDocValue.length;
    const actualValueLines = splitActualValue.length;
    const maxLines = Math.max(descriptionLines, docValueLines, actualValueLines);

    // Calculate height
    const lineHeight = 3.1;
    const padding = 2;
    const rowHeight = (maxLines * lineHeight) + padding * 2;

    // Draw columns
    doc.rect(leftMargin, yPosition, col1Width, rowHeight);
    doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight);
    doc.rect(leftMargin + col1Width + col2Width, yPosition, col3Width, rowHeight);
    doc.rect(leftMargin + col1Width + col2Width + col3Width, yPosition, col4Width, rowHeight);

    // Add text
    doc.setFont('helvetica', 'normal');
    if (number) {
        doc.text(number.toString(), leftMargin + 2, yPosition + 4);
    }

    // Add description
    doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 4);

    // Add document value and actual value with conditional bold
    if (docValue === 'As per Document' && actualValue === 'As per Actuals') {
        // Make headers bold
        doc.setFont('helvetica', 'bold');
        doc.text(splitDocValue, leftMargin + col1Width + col2Width + 2, yPosition + 4);
        doc.text(splitActualValue, leftMargin + col1Width + col2Width + col3Width + 2, yPosition + 4);
    } else {
        // Normal text for other rows
        doc.setFont('helvetica', 'normal');
        doc.text(splitDocValue, leftMargin + col1Width + col2Width + 2, yPosition + 4);
        doc.text(splitActualValue, leftMargin + col1Width + col2Width + col3Width + 2, yPosition + 4);
    }

    yPosition += rowHeight;
    return yPosition;
}

function addSplitColumnRow(number, description, col3Texts = ['Own Purpose', 'CAPITAL GAINS', 'Banks Purpose', 'Construction Loan']) {
    // Set font size consistently and calculate widths
    
    const col1Width = 7;
    const col2Width = 85;
    const col3Width = tableWidth - col1Width - col2Width;
    const col3SplitWidth = col3Width / 2;  // Split into 2 equal columns for grid
    
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
    const topRowHeight = lineHeight + padding * 2;  // Fixed height for top row
    const bottomRowHeight = (bottomRowLines * lineHeight) + padding * 2;
    const descriptionHeight = (descriptionLines * lineHeight) + padding * 2;
    
    // Total height should be maximum of description or sum of grid rows
    const rowHeight = Math.max(descriptionHeight, topRowHeight + bottomRowHeight);
    
    // Draw main columns
    doc.rect(leftMargin, yPosition, col1Width, rowHeight);
    doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight);
    
    // Draw grid in third column
    const col3Start = leftMargin + col1Width + col2Width;
    
    // Draw grid cells with fixed height for top row
    doc.rect(col3Start, yPosition, col3SplitWidth, topRowHeight);
    doc.rect(col3Start + col3SplitWidth, yPosition, col3SplitWidth, topRowHeight);
    doc.rect(col3Start, yPosition + topRowHeight, col3SplitWidth, rowHeight - topRowHeight);
    doc.rect(col3Start + col3SplitWidth, yPosition + topRowHeight, col3SplitWidth, rowHeight - topRowHeight);
    
    // Add text content with proper wrapping
    doc.setFont('helvetica', 'normal');
    doc.text(number.toString(), leftMargin + 2, yPosition + 4);
    doc.text(descriptionSplit, leftMargin + col1Width + 2, yPosition + 4);
    
    // Helper function to add wrapped text
    const addWrappedText = (text, x, y, width) => {
        const splitText = doc.splitTextToSize(text, width - 6);
        doc.text(splitText, x, y);
    };
    
    // Add grid cell text - top row with fixed text
    doc.setFont('helvetica', 'bold');
    doc.text(col3Texts[0], col3Start + 2, yPosition + 4);
    doc.text(col3Texts[1], col3Start + col3SplitWidth + 2, yPosition + 4);
    
    // Bottom row with auto-wrapped text
    doc.setFont('helvetica', 'normal');
    addWrappedText(col3Texts[2], col3Start + 2, yPosition + topRowHeight + 4, col3SplitWidth);
    addWrappedText(col3Texts[3], col3Start + col3SplitWidth + 2, yPosition + topRowHeight + 4, col3SplitWidth);
    
    yPosition += rowHeight;
    return yPosition;
}

function addRow(number, description, value, height = null, no_column = false) {
    // Set font size consistently
    
    
    // Calculate text length
    const textLength = description.length + (value ? value.length : 0);
    
    // Split text for measurement
    const splitDescription = doc.splitTextToSize(description, col2Width - 4);
    const splitValue = value ? doc.splitTextToSize(value, col3Width - 4) : [''];
    
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
        calculatedHeight = (maxLines * lineHeight) + padding; // Height for multiple lines
    }
    
    
    // If height parameter is provided, use it as minimum height
    const rowHeight = height ? Math.max(calculatedHeight, height) : calculatedHeight;

    if (no_column) {
        // Draw only two columns when no_column is true
        doc.rect(leftMargin , yPosition, col1Width, rowHeight);
        
        if (number) {
            doc.setFont('helvetica', 'normal');
            doc.text(number.toString(), leftMargin + 1, yPosition + 3);
            doc.rect(leftMargin + col1Width, yPosition, col2Width + col3Width, rowHeight);

        }
        
        // Set bold font for description when no_column is true
        doc.setFont('helvetica', 'bold');
        doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 3);
    } else {
        // Original three-column layout
        doc.rect(leftMargin, yPosition, col1Width, rowHeight);
        doc.rect(leftMargin + col1Width, yPosition, col2Width, rowHeight);
        doc.rect(leftMargin + col1Width + col2Width, yPosition, col3Width, rowHeight);
        
        if (number) {
            doc.setFont('helvetica', 'normal');
            doc.text(number.toString(), leftMargin + 2, yPosition + 3);
        }
        
        doc.setFont('helvetica', 'normal');
        doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 3);
        
        if (value && value.includes('Mrs')) {
            doc.setFont('helvetica', 'bold');
        }
        doc.text(splitValue, leftMargin + col1Width + col2Width + 2, yPosition + 3);
    }
    
    yPosition += rowHeight;
    return yPosition;
}

// Define column widths (adjusted for 9 columns)
const colWidths = {
    slNo: 7,
    particulars: 24,
    roof: 12,
    area: 17,
    rate: 15,
    amountIn: 26,
    deprnIn: 14,
    deprnAmount: 25,
    netAmount: 29
};

function addTableHeader(){
    yPosition += 6;
    // Add title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('BUILDING VALUE:', leftMargin, yPosition);
    yPosition += 2;
        // Header row
    doc.setFontSize(7);
    doc.rect(leftMargin, yPosition, colWidths.slNo, 10);
    doc.text('SL\nNo.', leftMargin + 1, yPosition + 4);
    
    let xPos = leftMargin + colWidths.slNo;
    doc.rect(xPos, yPosition, colWidths.particulars, 10);
    doc.text('PARTICULARS', xPos + 2, yPosition + 6);
    
    xPos += colWidths.particulars;
    doc.rect(xPos, yPosition, colWidths.roof, 10);
    doc.text('ROOF', xPos + 2, yPosition + 6);
    
    xPos += colWidths.roof;
    doc.rect(xPos, yPosition, colWidths.area, 10);
    doc.text('AREA IN\nSFT', xPos + 2, yPosition + 4);
    
    xPos += colWidths.area;
    doc.rect(xPos, yPosition, colWidths.rate, 10);
    doc.text('RATE IN\nRs', xPos + 2, yPosition + 4);
    
    xPos += colWidths.rate;
    doc.rect(xPos, yPosition, colWidths.amountIn, 10);
    doc.text('AMOUNT IN\nRs', xPos + 2, yPosition + 4);
    
    xPos += colWidths.amountIn;
    doc.rect(xPos, yPosition, colWidths.deprnIn, 10);
    doc.text('DEPRN\nIN %', xPos + 2, yPosition + 4);
    
    xPos += colWidths.deprnIn;
    doc.rect(xPos, yPosition, colWidths.deprnAmount, 10);
    doc.text('DEPRN\nAMOUNT', xPos + 2, yPosition + 4);
    
    xPos += colWidths.deprnAmount;
    doc.rect(xPos, yPosition, colWidths.netAmount, 10);
    doc.text('NET\nAMOUNT', xPos + 2, yPosition + 4);

    yPosition += 10;  
    }

// Function to add a row
function addRowT(slNo, particulars, roof, area, rate, amountIn, deprnIn, deprnAmount, netAmount) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);            
    let xPos = leftMargin;
    doc.rect(xPos, yPosition, colWidths.slNo, 7);
    if(slNo) doc.text(slNo.toString(), xPos + 1, yPosition + 4);
    
    xPos += colWidths.slNo;
    doc.rect(xPos, yPosition, colWidths.particulars, 7);
    doc.text(particulars, xPos + 1, yPosition + 4);
    
    xPos += colWidths.particulars;
    doc.rect(xPos, yPosition, colWidths.roof, 7);
    doc.text(roof, xPos + 1, yPosition + 4);
    
    xPos += colWidths.roof;
    doc.rect(xPos, yPosition, colWidths.area, 7);
    if(area) doc.text(area.toString(), xPos + 1, yPosition + 4);
    
    xPos += colWidths.area;
    doc.rect(xPos, yPosition, colWidths.rate, 7);
    if(rate) doc.text(rate.toString(), xPos + 1, yPosition + 4);
    
    xPos += colWidths.rate;
    doc.rect(xPos, yPosition, colWidths.amountIn, 7);
    if(amountIn) doc.text(amountIn.toString(), xPos + 1, yPosition + 4);
    
    xPos += colWidths.amountIn;
    doc.rect(xPos, yPosition, colWidths.deprnIn, 7);
    if(deprnIn) doc.text(deprnIn.toString(), xPos + 1, yPosition + 4);
    
    xPos += colWidths.deprnIn;
    doc.rect(xPos, yPosition, colWidths.deprnAmount, 7);
    if(deprnAmount) doc.text(deprnAmount.toString(), xPos + 1, yPosition + 4);
    
    xPos += colWidths.deprnAmount;
    doc.rect(xPos, yPosition, colWidths.netAmount, 7);
    if(netAmount) doc.text(netAmount.toString(), xPos + 1, yPosition + 4);
    
    yPosition += 7;
    return yPosition;
}

function addTitle(doc, title) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 25.7;
    const rightMargin = 17.5;

    // Calculate title width using getStringUnitWidth for accuracy
    const fontSize = 12.8;
    const titleWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
    console.log('Title Width:', titleWidth);
    const xPosition = (pageWidth - titleWidth) / 2; // Center the title

    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title, xPosition, yPosition); // Use yPosition instead of doc.autoTable.previous.finalY

    yPosition += 2;
    // Underline the title
    const yPositionForUnderline = yPosition; // Adjust y position for underline
    doc.setLineWidth(0.5);
    doc.line(xPosition, yPositionForUnderline, xPosition + titleWidth, yPositionForUnderline);
    console.log('Title Start position:', xPosition);
    console.log('Title End position:', xPosition + titleWidth);
    yPosition += 4;
}

function addParagraph(doc, paragraph) {
    if (typeof paragraph !== 'string') {
        console.error('Invalid paragraph: must be a string');
        return yPosition; // Return the original yPosition if paragraph is invalid
    }

    const leftMargin = 25.7;
    const rightMargin = 17.5;
    const pageWidth = doc.internal.pageSize.getWidth();
    const paragraphWidth = pageWidth - (leftMargin + rightMargin) ; // Adjust for margins
    const lineHeight = 4.5; // Define a consistent line height

    // Split the paragraph into lines that fit within the width
    const splitParagraph = doc.splitTextToSize(paragraph, paragraphWidth);                
    // Set font and size for the paragraph
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Add each line of the paragraph to the document
    splitParagraph.forEach((line) => {
        // Ensure line is a string before calling text
        if (typeof line === 'string') {
            doc.text(line, leftMargin, yPosition); // Use current yPosition
            yPosition += lineHeight; // Update yPosition for the next line
        } else {
            console.error('Invalid line: must be a string', line);
        }
    });

    // Return the new yPosition after adding the paragraph
    return yPosition; // Return the updated yPosition
}

async function addImageToPDF(doc, imagePath, type,imageWidth, imageHeight) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imagePath;

        img.onload = function() {
        const pageWidth = doc.internal.pageSize.getWidth();
        const leftMargin = 25.7;  
        const rightMargin = 17.5; 
        //const imageWidth = pageWidth - (leftMargin + rightMargin + 10); 
        const x = leftMargin + 1; // Start position for image
        //const imageHeight = 60; // Adjust as needed

        // Add the image to the PDF
        doc.addImage(img, type, x, yPosition, imageWidth, imageHeight);
        yPosition = yPosition + imageHeight + 5; // Update yPosition for the next element
        console.log('Image Start position:', x, yPosition);
        resolve(yPosition); // Return the new yPosition after adding the image
        };

        img.onerror = function() {
            console.error(`Error loading image: ${imagePath}`);
            resolve(yPosition); // Resolve with the current y position if the image fails to load
        };
    });
}

function addValuerDetails(description, value) {
    const col1Width = 60;
    const col2Width = tableWidth - col1Width;
    const splitDescription = doc.splitTextToSize(description, col1Width - 4);
    const splitValue = value ? doc.splitTextToSize(value, col2Width - 4) : [''];
   
    // Get number of lines for both description and value
    const descriptionLines = splitDescription.length;
    const valueLines = splitValue.length;
   
    // Use the maximum number of lines to determine height
    const maxLines = Math.max(descriptionLines, valueLines);
    const lineHeight = 3.5; 
    const padding = 2; // Minimum padding
   
    // Calculate height based on content
    let calculatedHeight = (maxLines * lineHeight) + padding; // Height for multiple lines

    // Draw the rectangle for the description and enter description
    doc.rect(leftMargin, yPosition, col1Width, calculatedHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(splitDescription, leftMargin + 1, yPosition + 4);

    // Draw the rectangle for the value and enter value
    doc.rect(leftMargin + col1Width, yPosition, col2Width, calculatedHeight);
    doc.setFont('helvetica', 'bold');
    doc.text(splitValue, leftMargin + col1Width + 2, yPosition + 4);    

    yPosition += calculatedHeight;
    return yPosition;
}

function addSimpleLine(line) {
    // Split text for measurement
    const splitLine= doc.splitTextToSize(line, tableWidth - 4);
   
    // Get number of lines for both description and value
    const splitLineNo = splitLine.length;
  
    const lineHeight = 3.5; 
    const padding = 2; // Minimum padding
   
    // Calculate height based on content
    let calculatedHeight = (splitLineNo * lineHeight) + padding; // Height for multiple lines

    // Draw the rectangle for the line and enter lines
    //doc.rect(leftMargin, yPosition, tableWidth, calculatedHeight);
    doc.setFont('helvetica', 'normal');
    doc.text(splitLine, leftMargin + 1, yPosition + 4);         
    yPosition += calculatedHeight;
    return yPosition;
}

function addBox() {
    // Draw the rectangle for the line and enter lines
    doc.rect(leftMargin, yPosition, tableWidth, 40);                  
    yPosition += 18;
    return yPosition;
}        

function addImageTitle(doc, title) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 25.7;
    const rightMargin = 17.5;

    // Calculate title width using getStringUnitWidth for accuracy
    const fontSize = 12.8;
    const titleWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
    console.log('Title Width:', titleWidth);
    const xPosition = leftMargin + 1; // Start position for title

    yPosition += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(title, xPosition, yPosition); // Use yPosition instead of doc.autoTable.previous.finalY

    yPosition += 1.5;
    // Underline the title
    const yPositionForUnderline = yPosition; // Adjust y position for underline
    doc.setLineWidth(0.5);
    doc.line(xPosition, yPositionForUnderline, xPosition + titleWidth, yPositionForUnderline);
    console.log('Title Start position:', xPosition);
    console.log('Title End position:', xPosition + titleWidth);
    yPosition += 2;
    return yPosition;
} 
return {
    addRow,
    addSplitColumnRow,
    addAddressRow,
    addAdjoiningPropertiesRow,
    addTableHeader,
    addRowT,
    addTitle,
    addParagraph, 
    addImageTitle,
    addSimpleLine,     
    addValuerDetails,
    addBox,
    addImageToPDF,
    getPosition: () => yPosition
};
}


function Container1(doc) {

    const Container_1 = JSON.parse(localStorage.getItem('Container_1'));
    console.log(Container_1);
    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();
    const tableWidth = pageWidth - (leftMargin + rightMargin); 
    let yPosition = 10;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    return new Promise((resolve) => {
        img.onload = function() {
            // Logo dimensions
            const logoWidth = 30;
            const logoHeight = 30;
            const logoX = pageWidth - rightMargin - logoWidth - 6;
            yPosition += 2; 
            doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);
                    
             // Draw the main outer box
             const pageHeight = doc.internal.pageSize.getHeight();
             doc.rect(leftMargin, yPosition, tableWidth, pageHeight - 45 );

            // Company header
            doc.setFontSize(16);
            doc.setTextColor(65, 105, 225);
            doc.setFont('helvetica', 'bold');
            doc.text('TRUE PEAK HOUSE LLP', leftMargin + 2, yPosition + 10);

            // Company details
            yPosition += 15;
            doc.setTextColor(55, 65, 81);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            const address = 'GSTIN: 29AAUFT3926A1ZW, #240/C, FIRST FLOOR, 3RD BLOCK, NAGARABHAVI 2ND STAGE,';
            doc.text(address, leftMargin + 2, yPosition);

            // Contact details
            yPosition += 5;
            const contact = 'Bengaluru: 560072. MOB: +91 9743142447 | balakrishna@truepeak.in | www.truepeak.in';
            doc.text(contact, leftMargin + 2, yPosition);  
            doc.setTextColor(0, 0, 255); // Blue #0000FF

            // Draw a line below the title
            doc.setLineWidth(0.5);
            yPosition += 9; 
            doc.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);          

            // Bank details        
            doc.setTextColor(0, 0, 0);
            //yPosition += 2;
            doc.setFont('helvetica', 'normal');
            doc.text('To,', leftMargin + 2, yPosition + 4);
            doc.setFont('times', 'bold');
            doc.text(Container_1.bankInfo.managerDesignation.toUpperCase(), leftMargin + 2, yPosition + 8);
            doc.text(Container_1.bankInfo.bankName.toUpperCase(), leftMargin + 2, yPosition + 12);
            doc.text(Container_1.bankInfo.branchLocation.toUpperCase(), leftMargin + 2, yPosition + 16);
        
            // Title section
            yPosition += 20;
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);

            // Centered title
            doc.text('VALUATION REPORT - IMMOVABLE PROPERTY', pageWidth / 2, yPosition + 5.5, { align: 'center' });

            // Get text width to align underline properly
            let textWidth = doc.getTextWidth('VALUATION REPORT - IMMOVABLE PROPERTY');
            let textX = (pageWidth - textWidth) / 2; // Centering the underline

            // Draw underline
            doc.line(textX, yPosition + 6, textX + textWidth, yPosition + 6); // Adjust `+7` for spacing

            // Create table instance
            yPosition += 5;
            let table = createTable(doc, yPosition, null, 'Type of Property – Under Construction Residential Land & Building');
            let yPos = table.getPosition();

            doc.setFontSize(8);

            // Purpose of Valuation
            yPos = table.addSplitColumnRow('1', 'Purpose of Valuation', [
                'Purpose',
                'Type',
                'Banks Purpose',
                'Construction Loan'
            ]);

            // Accompanying Person
            yPos = table.addRow('2', 'Name of Customer (s)/ Borrower unit (for which valuation report is sought) ', Container_1.propertyDetails.nameOfBorrower);

            // Customer Details
            yPos = table.addRow('3', 'Customer Details', '', null, true);
            yPos = table.addRow('a', 'Name of Owner', Container_1.customerDetails.customerName);
            // Accompanying Person
            yPos = table.addRow('b', 'Persons Accompanying / Contact No.', Container_1.customerDetails.personAccompanyingContactNo);
            yPos = table.addRow('c', 'Name of Purchaser', Container_1.customerDetails.nameOfPurchaser);
            yPos = table.addRow('d', 'Application No', Container_1.customerDetails.applicationNo);

            // Property Details with Address Array
            yPos = table.addRow('4', 'Property Details', '', null, true);
            yPos = table.addAddressRow('a', 'Address', Container_1.propertyLocation.address);

            yPos = table.addRow('b', 'Nearby Landmark/Google Map / Independent access to the property', Container_1.propertyLocation.nearbyLandmark);

            // Document Details
            yPos = table.addRow('5', 'Document Details', '', null, true);
            
            //Layout Plan
            yPos = table.addRow('a', 'Layout Plan',  null, true);
            yPos = table.addRow('i)', 'Yes/No', Container_1.documentDetails.lp_yesNo);
            yPos = table.addRow('ii)', 'Name of Approving Authority', Container_1.documentDetails.lp_nameOfApprovingAuthority);
            yPos = table.addRow('iii)', 'Approval No / Date / Details', Container_1.documentDetails.lp_approvalNoDetails);

            //Building Plan
            yPos = table.addRow('b', 'Building Plan',  null, true);
            yPos = table.addRow('i)', 'Yes/No', Container_1.documentDetails.bp_yesNo);
            yPos = table.addRow('ii)', 'Name of Approving Authority', Container_1.documentDetails.bp_nameOfApprovingAuthority);
            yPos = table.addRow('iii)', 'Approval No / Date / Details', Container_1.documentDetails.bp_approvalNoDetails);

            yPos = table.addRow('c', 'Legal & Other Documents', Container_1.documentDetails.legalDocuments);

            // Add Physical Details section
            yPos = table.addRow('6', 'Physical Details', '', null, true);

            // Add header row
            yPos = table.addAdjoiningPropertiesRow('a', 'Adjoining Properties:', 'As per Document', 'As per Actuals');
            
            // Add direction rows
            yPos = table.addAdjoiningPropertiesRow('i', 'East', Container_1.boundaries.east.doc, Container_1.boundaries.east.actual);
            yPos = table.addAdjoiningPropertiesRow('ii', 'West', Container_1.boundaries.west.doc, Container_1.boundaries.west.actual);
            yPos = table.addAdjoiningPropertiesRow('iii', 'North', Container_1.boundaries.north.doc, Container_1.boundaries.north.actual);
            yPos = table.addAdjoiningPropertiesRow('iv', 'South', Container_1.boundaries.south.doc, Container_1.boundaries.south.actual);
            yPos = table.addRow('b', 'Matching of Boundaries', Container_1.otherDetails.boundaryMatch);
            yPos = table.addRow('c', 'Plot Demarcated', Container_1.otherDetails.plotDemarcation);
            yPos = table.addRow('d)', 'Approved and Land Use', Container_1.otherDetails.landUse);
            yPos = table.addRow('e)', 'Types of property', Container_1.otherDetails.typeOfProperty);                
            resolve(yPos);
        };

        img.onerror = function() {
            console.error('Error loading logo');
            resolve(yPos);
        };
    });
}

function Container2(doc) {

    const Container_2 = JSON.parse(localStorage.getItem('Container_2'));
    console.log(Container_2);

    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    return new Promise((resolve) => {
        img.onload = function() {
            // Logo dimensions
            const logoWidth = 30;
            const logoHeight = 30;
            const logoX = pageWidth - rightMargin - logoWidth - 6;
            yPosition += 2; 
            doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);

            // Move yPosition downward to prevent overlap
            yPosition += logoHeight + 2;  

            const font_size = 8;
            doc.setFontSize(font_size);

            let table = createTable(doc, yPosition, '', '');
            let yPos = table.getPosition();
            yPos = table.addRow('f)', 'Details of Accommodations', 'As per Actual');
            yPos = table.addRow('i', 'Living/ Dinning', Container_2.livingStatus);
            yPos = table.addRow('ii', 'Bed Room & Pooja Room', Container_2.bedroomStatus);
            yPos = table.addRow('iii', 'Toilet', Container_2.toiletStatus);
            yPos = table.addRow('iv', 'Kitchen', Container_2.kitchenStatus);
            yPos = table.addRow('g', 'Total No of Floors', Container_2.totalFloors);
            yPos = table.addRow('h', 'Floor on which the property is located', Container_2.propertyFloor);
            yPos = table.addRow('i', 'Year of construction', Container_2.constructionYear);
            yPos = table.addRow('j', 'Approx. age of the Property', Container_2.propertyAge);
            yPos = table.addRow('h', 'Residual age of the Property', Container_2.residualAge);
            yPos = table.addRow('k', 'Type of structure', Container_2.structureType);
            yPos = table.addRow('l', 'Amenities provided', Container_2.amenities);
            yPos = table.addRow('7', 'Tenure / Occupancy Details', '', 8, true);
            yPos = table.addRow('', 'Status of Tenure', '', 8, true);
            yPos = table.addRow('i', 'Owned /Rented', Container_2.ownedOrRented);
            yPos = table.addRow('ii', 'No. of years of Occupancy', Container_2.occupancyYears);
            yPos = table.addRow('iii', 'Relationship of tenant or owner', Container_2.relationOfTenant);
            yPos = table.addRow('8', 'Building Status', '', 8, true);
            yPos = table.addRow('i', 'Existing building', Container_2.existingBuilding);
            yPos = table.addRow('ii', 'Stage of construction', Container_2.constructionStage, 16);
            yPos = table.addRow('iii', 'If under construction, extent of completion ', Container_2.workCompletion);
            yPos = table.addRow('9', 'Violations if any observed', '', 8, true);
            yPos = table.addRow('i', 'Nature and extent of violations', Container_2.violations, 16);
            yPos = table.addRow('10', 'Area Details of the Property', '', 8, true);

            //yPos = table.addRow('i', 'Site Area', '', null, true);
            const siteAreaData = {
                row1: ['East to West', Container_2.eastToWest],
                row2: ['North to South', Container_2.northToSouth],
                row3: ['Totally Measuring', Container_2.totallyMeasuring],
            };
            yPos = table.addAddressRow('i', 'Site Area', siteAreaData);

            yPos = table.addRow('ii', 'Plinth area', Container_2.plinthArea);
            yPos = table.addRow('iii', 'Carpet area', Container_2.carpetArea);
            yPos = table.addRow('iv', 'Saleable area', Container_2.saleableArea);
            yPos = table.addRow('v', 'Remarks', Container_2.remarks);

        // Resolve the promise after the table is completed
        resolve(yPos);
    };

    img.onerror = function() {
        console.error('Error loading logo');
        resolve(yPos);
    };
    });
}

function Container3(doc) {
    const Container_3 = JSON.parse(localStorage.getItem('Container_3'));
    console.log(Container_3);
    const actualsData = JSON.parse(localStorage.getItem('actualsData')) || [];
    const planData = JSON.parse(localStorage.getItem('planData')) || [];
    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    return new Promise((resolve) => {
        img.onload = function() {
            // Logo dimensions
            const logoWidth = 30;
            const logoHeight = 30;
            const logoX = pageWidth - rightMargin - logoWidth - 6;
            yPosition += 2; 
            doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);

            // Move yPosition downward to prevent overlap
            yPosition += logoHeight + 2;  


            const font_size = 8;
            doc.setFontSize(font_size);

            let table = createTable(doc, yPosition, '', '');
            let yPos = table.getPosition();

        // Add first and second rows (existing) 
            yPos = table.addRow('11', 'Valuation Note', '', 8, true);
            yPos = table.addRow('a (i) ', 'Mention the value as per Government Approved Rates also', Container_3.govtValue);

            yPos = table.addRow('ii', 'In case of variation of 20 % or more in the valuation proposed by the valuer and the Guideline value provided in the State Govt. notification or Income Tax Gazette justification on variation has to be given',Container_3.variationJustification);
            yPos = table.addRow('b', 'Summary of Valuation', '', 8, true);
            yPos = table.addRow('i', 'Guideline Rate ',Container_3.guidelineRate);
            yPos = table.addRow('ii', 'Market Rate',Container_3.marketRate);

            yPos = table.addRow('iii', 'Land Value ',Container_3.landValue);
            yPos = table.addRow('iv', 'Building Value ',Container_3.buildingValue);
            yPos = table.addRow('v', 'Extra items, Amenities & Services',Container_3.extraItems);
            yPost = table.addRow('vi', 'Fair Market Value (SAY)', Container_3.fairMarketValue);
            yPost = table.addRow('c(vii)', ' Expected Rental Value ', Container_3.rentalValue);

            // Add data rows with all columns        
            yPost = table.addTableHeader();   

            yPos = table.addRow('', 'AS PER ACTUALS', '', 8, true);

            actualsData.forEach((row, index) => {
                const floor = row[Object.keys(row).find(key => key.includes('Floor'))];
                const roofType = row[Object.keys(row).find(key => key.includes('RoofType'))];
                const area = row[Object.keys(row).find(key => key.includes('Area'))];
                const rate = row[Object.keys(row).find(key => key.includes('Rate'))];
                const amount = row[Object.keys(row).find(key => key.includes('Amount'))];
                const deprn = row[Object.keys(row).find(key => key.includes('Deprn'))];
                const deprnAmount = row[Object.keys(row).find(key => key.includes('DeprnAmount'))];
                const netAmount = row[Object.keys(row).find(key => key.includes('NetAmount'))];

                yPos = table.addRowT(index + 1, floor, roofType, area, rate, amount, deprn, deprnAmount, netAmount);
            });

            yPos = table.addRow('', 'AS PER PLAN', '', 8, true);
            planData.forEach((row, index) => {
                const floor = row[Object.keys(row).find(key => key.includes('Floor'))];
                const roofType = row[Object.keys(row).find(key => key.includes('RoofType'))];
                const area = row[Object.keys(row).find(key => key.includes('Area'))];
                const rate = row[Object.keys(row).find(key => key.includes('Rate'))];
                const amount = row[Object.keys(row).find(key => key.includes('Amount'))];
                const deprn = row[Object.keys(row).find(key => key.includes('Deprn'))];
                const deprnAmount = row[Object.keys(row).find(key => key.includes('DeprnAmount'))];
                const netAmount = row[Object.keys(row).find(key => key.includes('NetAmount'))];

                yPos = table.addRowT(index + 1, floor, roofType, area, rate, amount, deprn, deprnAmount, netAmount);
            });
              // Resolve the promise after the table is completed
              resolve(yPos);
            };
        
            img.onerror = function() {
                console.error('Error loading logo');
                resolve(yPos);
            };
            });
}

function Container4(doc) {
    const Container_4 = JSON.parse(localStorage.getItem('Container_4'));
    console.log(Container_4);
    
    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    return new Promise((resolve) => {
        img.onload = function() {
            // Logo dimensions
            const logoWidth = 30;
            const logoHeight = 30;
            const logoX = pageWidth - rightMargin - logoWidth - 6;
            yPosition += 2; 
            doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);

            // Move yPosition downward to prevent overlap
            yPosition += logoHeight + 2;  


            const font_size = 8;
            doc.setFontSize(font_size);

            let table = createTable(doc, yPosition, '', '');
            let yPos = table.getPosition();
    
            // section B: EXTRA ITEM
            yPos = table.addRow('B', 'EXTRA ITEM', 'Amount in Rs.',6, true);
            yPos = table.addRow('1', 'Portico', Container_4.porticoStatus);
            yPos = table.addRow('2', 'Ornamental front door', Container_4.frontDoorStatus);
            yPos = table.addRow('3', 'Sit out / Verandah with steel grills', Container_4.verandahStatus);
            yPos = table.addRow('4', 'Bore well / Overhead Tank / Sump / Solar', Container_4.boreWellStatus);
            yPos = table.addRow('5', 'Extra steel / Collapsible gates', Container_4.gatesStatus);
            yPos = table.addRow('', 'Extra Item Totals', Container_4.extraItemsTotal);
            
            // section C: AMENITIES
            yPos = table.addRow('C', 'AMENITIES', '',6, true);
            yPos = table.addRow('1', 'Wardrobes', Container_4.wardrobesStatus);
            yPos = table.addRow('2', 'Glazed Tiles', Container_4.glazedTilesStatus);
            yPos = table.addRow('3', 'Extra sinks & bath tubs', Container_4.bathTubsStatus);
            yPos = table.addRow('4', 'Marble / Ceramic tiles flooring', Container_4.marbleFlooringStatus);
            yPos = table.addRow('5', 'Interior decorations', Container_4.interiorStatus);
            yPos = table.addRow('6', 'Architectural Elevation works', Container_4.architecturalStatus);
            yPos = table.addRow('7', 'Paneling works', Container_4.panelingStatus);
            yPos = table.addRow('8', 'Aluminium works', Container_4.aluminiumStatus);
            yPos = table.addRow('9', 'Aluminium hand rails', Container_4.handRailsStatus);
            yPos = table.addRow('10', 'False ceilings', Container_4.falseCeilingStatus);
            yPos = table.addRow('', ' Amenities Totals', Container_4.amenitiesTotal);

            //section D: MISCELLANEOUS
            yPos = table.addRow('D', 'MISCELLANEOUS', '',6, true);
            yPos = table.addRow('1', 'Separate toilet room', Container_4.separateToilet);
            yPos = table.addRow('2', 'Separate lumber room', Container_4.separateLumber);            
            yPos = table.addRow('', 'Miscellaneous Totals', Container_4.miscellaneousTotal);

            //section E: SERVICES
            yPos = table.addRow('E', 'SERVICES', '',6, true);
            yPos = table.addRow('1', 'Water Supply Arrangements', Container_4.waterSupplyArrangement);
            yPos = table.addRow('2', 'Drainage Arrangements', Container_4.drainageArrangements);
            yPos = table.addRow('3', 'Compound wall / Gate', Container_4.compoundWall);
            yPos = table.addRow('4', 'C.B. Deposits, Fittings, Power etc.,', Container_4.depositsFittings);
            yPos = table.addRow('5', 'Pavement', Container_4.pavement);
            yPos = table.addRow('', 'Services Totals', Container_4.servicesTotal);

            // Grand Total Section            
            yPos = table.addRow('', 'Grand Totals', Container_4.grandTotal);
                     
            //return yPos;       
        // Resolve the promise after the table is completed
        resolve(yPos);
      };
  
      img.onerror = function() {
          console.error('Error loading logo');
          resolve(yPos);
      };
      });
}

function Container5(doc) {
    const Container_5 = JSON.parse(localStorage.getItem('Container_5'));
    console.log(Container_5);
    
    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    return new Promise((resolve) => {
        img.onload = function() {
            // Logo dimensions
            const logoWidth = 30;
            const logoHeight = 30;
            const logoX = pageWidth - rightMargin - logoWidth - 6;
            yPosition += 2; 
            doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);

            // Move yPosition downward to prevent overlap
            yPosition += logoHeight + 2;  


            const font_size = 8;
            doc.setFontSize(font_size);

            let table = createTable(doc, yPosition, '', '');
            let yPos = table.getPosition();
    
            // TOTAL ABSTRACT OF THE ENTIRE PROPERTY
            yPos = table.addRow(' ', 'TOTAL ABSTRACT OF THE ENTIRE PROPERTY','',8, true);
            yPos = table.addRow('I', 'MARKET VALUE OF THE PROPERTY','',8, true);
            yPos = table.addRow('A', 'Land Market Value (Rs.)', Container_5.landValue);
            yPos = table.addRow('B', 'Building Market Value (Rs.)', Container_5.buildingValue);
            yPos = table.addRow('C', 'Extra Items Value', Container_5.extraItemsValue);
            yPos = table.addRow('D', 'Aminities Value', Container_5.amenitiesValue);
            yPos = table.addRow('E', 'Miscellaneous Value', Container_5.miscellaneousValue);
            yPos = table.addRow('F', 'Services Value', Container_5.servicesValue);
            yPos = table.addRow('', 'TOTAL MARKET VALUE', Container_5.totalMarketValue);
            yPos = table.addRow('', 'SAY MARKET VALUE', Container_5.sayMarketValue);
            yPos = table.addRow('', 'REALISABLE SALE VALUE', Container_5.realisableSaleValue);
            yPos = table.addRow('', 'FORCED SALE VALUE', Container_5.forcedSaleValue);
            
            // GUIDANCE VALUE OF THE PROPERTY
            yPos = table.addRow('II', 'GUIDANCE VALUE OF THE PROPERTY','',8, true);            
            yPos = table.addRow('1', 'LAND GUIDANCE VALUE', Container_5.gLandValue);
            yPos = table.addRow('2', 'BUILDING GUIDANCE VALUE', Container_5.gBuildingValue);
            yPos = table.addRow('3', 'TOTAL GUIDANCE VALUE', Container_5.totalGuidanceValue);
            yPos = table.addRow('4', 'SAY GUIDANCE VALUE', Container_5.sayGuidanceValue);

            // Add Title
            yPos = table.addTitle(doc, "VALUATION CERTIFICATE");

            // Add Paragraph
            const paragraph = Container_5.valuationCertificate;
            yPos = table.addParagraph(doc, paragraph);

            // Add Title
            yPos = table.addTitle(doc, "Declaration");
            // Add Paragraph
            const l = Container_5.declaration;
            yPos = table.addParagraph(doc, l);
            const l1 = Container_5.declaration1;
            yPos = table.addParagraph(doc, l1);
            const l2 = Container_5.declaration2;
            yPos = table.addParagraph(doc, l2);
            const l3 = Container_5.declaration3;
            yPos = table.addParagraph(doc, l3);
            const l4 = Container_5.declaration4;
            yPos = table.addParagraph(doc, l4);
            const l5 = Container_5.declaration5;
            yPos = table.addParagraph(doc, l5);
            const l6 = Container_5.declaration6;
            yPos = table.addParagraph(doc, l6);
            const l7 = Container_5.declaration7;
            yPos = table.addParagraph(doc, l7);
            const l8 = Container_5.declaration8;
            yPos = table.addParagraph(doc, l8);

            
            
        // Resolve the promise after the table is completed
        resolve(yPos);
      };
  
      img.onerror = function() {
          console.error('Error loading logo');
          resolve(yPos);
      };
      });
}

async function Container6(doc) {
    const Container_6 = JSON.parse(localStorage.getItem('Container_6'));
    console.log(Container_6);
    const googleMapData = JSON.parse(localStorage.getItem('googleMapData'));
    const glImageData = JSON.parse(localStorage.getItem('glImageData'));
    console.log(googleMapData);
    console.log(glImageData);
    
    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = pageWidth - rightMargin - logoWidth - 6;
    yPosition += 2; 
    doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);

    // Move yPosition downward to prevent overlap
    yPosition += logoHeight + 2;  


    const font_size = 8;
    doc.setFontSize(font_size);

    let table = createTable(doc, yPosition, '', '');
    let yPos = table.getPosition();

    // TOTAL ABSTRACT OF THE ENTIRE PROPERTY
    yPos = table.addValuerDetails('Name of the Valuer', 'Mr BALAKRISHNA R');
    yPos = table.addValuerDetails('Address', '# 240/C, First floor, 3rd Block, Nagarabhavi 2nd stage, Bangalore-560072');
    yPos = table.addValuerDetails('Name of valuer association of which I am a bonafide member in good standing ', 'Indian Institute of Engineers');
    yPos = table.addValuerDetails('Wealth tax Registration No ', 'CAT-I/Reg.No.02/PCIT-I/CCIT/BNG-1/2023-24');
    yPos = table.addBox();
    yPos = table.addSimpleLine('Seal & Signature of the Valuer');
    yPos = table.addSimpleLine('Date        : 2nd  DECEMBER 2024');
    yPos = table.addSimpleLine('Mobile No   : 9743142447');
    yPos = table.addSimpleLine('Email       : balakrishna@truepeak.in');
    console.log('yPos:', yPos);
    // Add Title
    yPos = table.addImageTitle(doc, "GOOGLEMAP:");  
    yPos = table.addSimpleLine('Longitude & Latitude Points: 13.024953, 77.594695');

    // Load and add the Google Map image
    if (googleMapData) {
        yPos = await table.addImageToPDF(doc, googleMapData.src, 'JPEG', googleMapData.width, googleMapData.height);
    }
   
    // Add Title
    yPos = table.addImageTitle(doc, "GOOGLEMAP:");  
    yPos = table.addSimpleLine('Longitude & Latitude Points: 13.024953, 77.594695');

    // Load and add the guideline rate image
    if (glImageData) {                
        yPos =  await table.addImageToPDF(doc, glImageData.src, 'JPEG', glImageData.width, glImageData.height);
    }
}

async function Container7(doc) {
    // Retrieve imagesData from local storage
    const imagesData = JSON.parse(localStorage.getItem('imagesData'));
    console.log(imagesData);

    // Check if imagesData is valid
    if (!imagesData || !Array.isArray(imagesData)) {
        console.error('No valid images data found in local storage.');
        return;
    }

    // Initial settings
    const leftMargin = 25.7;  
    const rightMargin = 17.5; 
    const pageWidth = doc.internal.pageSize.getWidth();    
    let yPosition = 0;

    // Add logo on the right side
    const img = new Image();
    img.src = 'images/logo.png';

    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = pageWidth - rightMargin - logoWidth - 6;
    yPosition += 2; 
    doc.addImage(img, 'PNG', logoX , yPosition, logoWidth, logoHeight);

    // Move yPosition downward to prevent overlap
    yPosition += logoHeight + 2;  

    // Set the position for the image grid
    const gridStartY = yPosition + 10; // Start position for the image grid
    const imageWidth = (pageWidth - leftMargin - rightMargin - 20) / 3; // Width for each image
    const imageHeight = imageWidth; // Maintain aspect ratio (square images)

    // Loop through the images and add them to the PDF in a 3x3 grid
    for (let i = 0; i < imagesData.length; i++) {
        const imgData = imagesData[i].src; // Get the image source
        const col = i % 3; // Column index (0, 1, 2)
        const row = Math.floor(i / 3); // Row index (0, 1, 2)
        const xPosition = leftMargin + col * (imageWidth + 10); // X position for the image
        const yPositionForImage = gridStartY + row * (imageHeight + 10); // Y position for the image

        // Add the image to the PDF
        await addImageToPDF(doc, imgData, 'JPEG', imageWidth, imageHeight, xPosition, yPositionForImage);
    }

    // Move yPosition down to just above the footer
    yPosition = gridStartY + Math.ceil(imagesData.length / 3) * (imageHeight + 10) + 10; // Adjust yPosition for footer

    return { getPosition: () => yPosition };
}
   

// Modify the addImageToPDF function to accept x and y positions
async function addImageToPDF(doc, imagePath, type, imageWidth, imageHeight, x, y) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imagePath;

        img.onload = function() {
            // Add the image to the PDF at the specified position
            doc.addImage(img, type, x, y, imageWidth, imageHeight);
            resolve(); // Resolve the promise when done
        };

        img.onerror = function() {
            console.error(`Error loading image: ${imagePath}`);
            resolve(); // Resolve even if there's an error
        };
    });
}

function addFooter(doc) {
        const leftMargin = 25.7;  
        const rightMargin = 17.5; 
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
         // Add horizontal line at the bottom
         const footerY = pageHeight - 28.7 ;
        doc.setLineWidth(0.1);
        //doc.line(leftMargin, footerY, pageWidth - rightMargin, footerY);    
        
        // Page number on right
        doc.text('Page 2', pageWidth - rightMargin - 40, footerY);
        doc.text('Ref No.', pageWidth - rightMargin - 40, footerY + 3.5);
        // Reference number 
        doc.text('TP/JCB/K-BKR/R-09/12/2024-25', pageWidth - rightMargin - 40, footerY + 7);
    }
