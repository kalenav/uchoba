from abc import ABC, abstractmethod
import xml.sax
from xml.dom.minidom import Document
from model import Student

class IStorage(ABC):
    @abstractmethod
    def save(self, data):
        pass

    @abstractmethod
    def load(self):
        pass

class InMemoryStorage(IStorage):
    def __init__(self, data):
        self.__data = data

    def save(self, data):
        self.__data = data
        
    def load(self):
        if self.__data == None:
            raise StorageIsEmptyException("Unable to load data from in-memory storage: storage is empty.")

        return self.__data

class StorageIsEmptyException(Exception):
    pass

class XMLStorage(IStorage):
    def __init__(self, file_path: str):
        self.__reader = XMLReader(file_path)
        self.__writer = XMLWriter(file_path)

    def save(self, data):
        self.__writer.write(data)

    def load(self):
        return self.__reader.read()

class XMLReader(xml.sax.ContentHandler):
    def __init__(self, file_path):
        self._file_path = file_path
        self.__read_data = []
        self.parser = xml.sax.make_parser()

    def startElement(self, tag, attributes):
        self.current = tag
        if tag == "student":
            self.__current_model = Student()
            self.__read_data.append(self.__current_model)
            pass

    def characters(self, content):
        if self.current == "name":
            self.__current_model.name = content
        elif self.current == "course":
            self.__current_model.course = int(content)
        elif self.current == "group":
            self.__current_model.group = content
        elif self.current == "completed":
            self.__current_model.completed = int(content)
        elif self.current == "overall":
            self.__current_model.overall = int(content)
        elif self.current == "language":
            self.__current_model.lang = content

    def endElement(self, tag):
        self.current = ""

    def read(self):
        self.__read_data = []
        parser = xml.sax.make_parser()
        parser.setFeature(xml.sax.handler.feature_namespaces, 0)
        parser.setContentHandler(self)
        parser.parse(self._file_path)

        return self.__read_data

class XMLWriter():
    def __init__(self, file_path: str):
        self.__file_path = file_path
        self.xml_document = Document()

    def write(self, students):
        xml_document_data = self.xml_document.createElement("students")

        for student in students:
            xml_document_data.appendChild(self.__parse_student(student))

        self.xml_document.appendChild(xml_document_data)
        self.xml_document.writexml(open(self.__file_path, 'w'), indent = "  ", addindent = "  ", newl = '\n')
        self.xml_document.unlink()

    def __parse_student(self, student):
        xml_student = self.xml_document.createElement("student")
        
        xml_student.appendChild(self.__parse_property("name", student.name))
        xml_student.appendChild(self.__parse_property("course", student.course.__str__()))
        xml_student.appendChild(self.__parse_property("group", student.group))
        xml_student.appendChild(self.__parse_property("completed", student.completed.__str__()))
        xml_student.appendChild(self.__parse_property("overall", student.overall.__str__()))
        xml_student.appendChild(self.__parse_property("language", student.lang))

        return xml_student

    def __parse_property(self, attribute_name: str, value: str):
        temp_child = self.xml_document.createElement(attribute_name)
        node_text = self.xml_document.createTextNode(value)
        temp_child.appendChild(node_text)
        
        return temp_child