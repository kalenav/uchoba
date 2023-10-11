from kivy.app import App
from view import AppScreenManager
from storage import InMemoryStorage, XMLStorage
from model import Student

class Controller(App):

    def __init__(self, **kwargs) -> None:
        super().__init__()
        self.storage = InMemoryStorage([])
        self.screen_manager = AppScreenManager()
        self.skipping = 0
        self.showing = 10
        self.saving = False
        self.filter_config = {}

    def build(self):
        return self.screen_manager

    def add_entry(self, name, course, group, completed, overall, lang):
        data = self.storage.load()
        data.append(Student(name, int(course or 1), group, int(completed or 0), int(overall or 0), lang))
        self.storage.save(data)
        self.display_table(self.find_entries(None))

    def find_entries(self, params_obj):
        if params_obj != None:
            self.filter_config = params_obj
        data = self.storage.load()
        if 'name' in self.filter_config and self.filter_config['name'] != '':
            data = list(filter(lambda stud: self.filter_config['name'] in stud.name, data))
        if 'group' in self.filter_config and self.filter_config['group'] != '':
            data = list(filter(lambda stud: self.filter_config['group'] == stud.group, data))
        if 'course' in self.filter_config and self.filter_config['course'] != '':
            data = list(filter(lambda stud: int(self.filter_config['course']) == stud.course, data))
        if 'completed' in self.filter_config and self.filter_config['completed'] != '':
            data = list(filter(lambda stud: int(self.filter_config['completed']) == stud.completed, data))
        if 'overall' in self.filter_config and self.filter_config['overall'] != '':
            data = list(filter(lambda stud: int(self.filter_config['overall']) == stud.overall, data))
        return data

    def delete_entries(self, params_obj):
        CURR_FILTER_CONFIG = self.filter_config
        TO_DELETE = self.find_entries(params_obj)
        CURR = self.storage.load()
        self.storage.save([stud for stud in CURR if not stud in TO_DELETE])
        self.filter_config = CURR_FILTER_CONFIG
        self.screen_manager.current_screen.change_misc_text(self.showing, True, len(TO_DELETE))

    def next(self):
        if(len(self.storage.load()) - self.skipping <= self.showing):
            return
        self.skipping += self.showing
        self.display_table(self.find_entries(None))
    
    def previous(self):
        if(self.skipping - self.showing < 0):
            return
        self.skipping -= self.showing
        self.display_table(self.find_entries(None))

    def load(self, filename):
        self.screen_manager.current_screen.display_table([])
        data = XMLStorage(filename[0]).load()
        self.storage.save(data)
        self.display_table(self.find_entries(None))

    def save(self, filename):
        XMLStorage(filename[0]).save(self.storage.load())
        self.saving = False

    def display_table(self, data):
        self.screen_manager.current_screen.display_table(data[(self.skipping):(self.skipping + self.showing)])

    def clear_filters(self):
        self.display_table(self.find_entries({}))

    def change_shown_entries_quantity(self, quantity):
        self.skipping = 0
        self.showing = quantity
        self.display_table(self.storage.load())
        self.screen_manager.current_screen.change_misc_text(quantity, False, None)