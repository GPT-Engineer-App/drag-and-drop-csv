import React, { useState } from "react";
import { Container, VStack, Text, Button, Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";
import { CSVReader } from "react-papaparse";
import { FaPlus, FaTrash, FaDownload } from "react-icons/fa";

const Index = () => {
  
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleDrop = (results) => {
    const rows = results.data;
    setHeaders(rows[0]);
    setData(rows.slice(1));
  };

  const addRow = () => {
    setData([...data, Array(headers.length).fill("")]);
  };

  const removeRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleInputChange = (e, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = e.target.value;
    setData(newData);
  };

  const downloadCSV = () => {
    const csvContent = [
      headers.join(","),
      ...data.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "edited_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Drag and Drop CSV Tool</Text>
        <CSVReader onUploadAccepted={(results) => handleDrop(results)}>
          {({ getRootProps, acceptedFile }) => (
            <>
              <Button {...getRootProps()} colorScheme="teal" size="lg">
                {acceptedFile ? acceptedFile.name : "Drop CSV File Here or Click to Upload"}
              </Button>
            </>
          )}
        </CSVReader>
        {data.length > 0 && (
          <>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {headers.map((header, index) => (
                    <Th key={index}>{header}</Th>
                  ))}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((row, rowIndex) => (
                  <Tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <Td key={colIndex}>
                        <Input
                          value={cell}
                          onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                        />
                      </Td>
                    ))}
                    <Td>
                      <Button colorScheme="red" size="sm" onClick={() => removeRow(rowIndex)}>
                        <FaTrash />
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button leftIcon={<FaPlus />} colorScheme="green" onClick={addRow}>
              Add Row
            </Button>
            <Button leftIcon={<FaDownload />} colorScheme="blue" onClick={downloadCSV}>
              Download CSV
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Index;