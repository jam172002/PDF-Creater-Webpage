
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


    function addRow(number, description, value, height = null, no_column = false) {
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
       const lineHeight = 3.5; // Reduced base height per line
       const padding = 1; // Minimum padding
       
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
               doc.text(number.toString(), leftMargin + 1, yPosition + 4);
               doc.rect(leftMargin + col1Width, yPosition, col2Width + col3Width, rowHeight);

           }
           
           // Set bold font for description when no_column is true
           doc.setFont('helvetica', 'bold');
           doc.text(splitDescription, leftMargin + col1Width + 2, yPosition + 4);
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
           
           
           doc.text(splitValue, leftMargin + col1Width + col2Width + 2, yPosition + 3);
       }
       
       yPosition += rowHeight;
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
       
return {  
    addTitle,
    addParagraph,     
    addRow,
    getPosition: () => yPosition
};
}

async function generatePDF() {
const { jsPDF } = window.jspdf;
const doc = new jsPDF();

await Container4(doc, Container_4)
addFooter(doc)
return doc;
}