
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


return {       
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