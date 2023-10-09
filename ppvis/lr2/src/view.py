ENTRY_LABEL_COUNT = 6
WHITE = (1, 1, 1, 1)
BLACK = (0, 0, 0, 1)
SINGLE_PAGE_MAX_ENTRY_COUNT = 10
BOTTOM_PADDING = 50
MISC_TEXT_BLOCK_WIDTH = 800
MISC_TEXT_BLOCK_HEIGHT = 40
SHOWN_ENTRIES_LABEL_WIDTH = 800

from functools import partial
from typing import Text
from kivy.uix.screenmanager import Screen, ScreenManager
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.stacklayout import StackLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.actionbar import ActionBar
from kivy.uix.filechooser import FileChooserIconView
from kivy.clock import Clock
from kivy.core.window import Window
from kivy.lang import Builder
from model import Student

Builder.load_file("custom_widgets.kv")
Window.clearcolor = WHITE

class MainView(Screen):
    
    def __init__(self, **kw):
        super().__init__(**kw)
        self.add_widget(MainActionBar(), 2)
        self.add_widget(MiscTextContainer(10), 1)
        self.add_widget(Table([]), 0)
    
    def display_table(self, students):
        self.remove_widget(self.children[0])
        self.add_widget(Table(students), 0)

    def change_misc_text(self, quantity, deleted, deleted_quantity):
        if deleted:
            if deleted_quantity > 0:
                self.children[2].change_misc_text(f'Showing {quantity} entries per page; Deleted {deleted_quantity} entries')
            else:
                self.children[2].change_misc_text(f'Showing {quantity} entries per page; no entries to delete were found')
            Clock.schedule_once(lambda q: self.children[2].change_misc_text(f'Showing {quantity} entries per page'), 2)
        else:
            self.children[2].change_misc_text(f'Showing {quantity} entries per page')


class FileChooserView(Screen):

    def __init__(self, **kw):
        super().__init__(**kw)
        self.add_widget(FileChooserIconView())
        self.add_widget(FileChooserActionBar())


class NewEntryView(Screen):

    def __init__(self, **kw):
        super().__init__(**kw)
        self.add_widget(NewEntryPromptBlock())
        self.add_widget(AddEntryActionBar())


class FilterView(Screen):
    def __init__(self, **kw):
        super().__init__(**kw)
        self.add_widget(NewEntryPromptBlock())
        self.add_widget(FilterActionBar())


class DeleteView(Screen):
    def __init__(self, **kw):
        super().__init__(**kw)
        self.add_widget(NewEntryPromptBlock())
        self.add_widget(DeleteActionBar())


class ChangeShownEntriesQuantityView(Screen):
    def __init__(self, **kw):
        super().__init__(**kw)
        self.add_widget(PromptTextInput(pos=(130, 100), size=(100, 40), size_hint=(None, None)))
        self.add_widget(PromptLabel(text='New pagination:', pos=(20, 100), size=(100, 40), size_hint=(None, None)))
        self.add_widget(ChangeShownEntriesQuantityActionBar())


class AppScreenManager(ScreenManager):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.add_widget(MainView(name='main'))
        self.add_widget(FileChooserView(name='file_choose'))
        self.add_widget(NewEntryView(name='new_entry'))
        self.add_widget(FilterView(name='filter'))
        self.add_widget(DeleteView(name='delete'))
        self.add_widget(ChangeShownEntriesQuantityView(name='pagination'))
        


class Table(StackLayout):

    def __init__(self, students, **kwargs):
        super().__init__(**kwargs)  
        self.orientation = 'tb-lr'
        self.padding = [0, 0, 0, BOTTOM_PADDING + 40]
        for student in students:
            self.add_widget(Entry(student))


class Entry(BoxLayout):

    def __init__(self, student, **kwargs):
        super().__init__(**kwargs)  
        self.orientation = 'horizontal'
        self.size_hint_y = 1 / SINGLE_PAGE_MAX_ENTRY_COUNT
        ENTRY_WIDTH = self.width / ENTRY_LABEL_COUNT
        self.add_widget(EntryLabel(ENTRY_WIDTH, text=f'{student.name}'))
        self.add_widget(EntryLabel(ENTRY_WIDTH, text=f'{student.course}'))
        self.add_widget(EntryLabel(ENTRY_WIDTH, text=f'{student.group}'))
        self.add_widget(EntryLabel(ENTRY_WIDTH, text=f'{student.completed}'))
        self.add_widget(EntryLabel(ENTRY_WIDTH, text=f'{student.overall}'))
        self.add_widget(EntryLabel(ENTRY_WIDTH, text=f'{student.lang}'))


class EntryLabel(Label):

    def __init__(self, width, **kwargs):
        super().__init__(**kwargs)
        self.width = width
        self.color = BLACK


class MainActionBar(ActionBar):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class FileChooserActionBar(ActionBar):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class AddEntryActionBar(ActionBar):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class FilterActionBar(ActionBar):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        
class DeleteActionBar(ActionBar):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class ChangeShownEntriesQuantityActionBar(ActionBar):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class NewEntryPromptBlock(GridLayout):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.padding = [0, 0, 0, BOTTOM_PADDING]
        self.rows = ENTRY_LABEL_COUNT
        self.cols = 2

        self.add_widget(PromptLabel(text='Student name: '))
        self.name = PromptTextInput(multiline=False)
        self.add_widget(self.name)

        self.add_widget(PromptLabel(text='Course: '))
        self.course = PromptTextInput(multiline=False)
        self.add_widget(self.course)

        self.add_widget(PromptLabel(text='Group: '))
        self.group = PromptTextInput(multiline=False)
        self.add_widget(self.group)

        self.add_widget(PromptLabel(text='Completed: '))
        self.completed = PromptTextInput(multiline=False)
        self.add_widget(self.completed)

        self.add_widget(PromptLabel(text='Overall: '))
        self.overall = PromptTextInput(multiline=False)
        self.add_widget(self.overall)

        self.add_widget(PromptLabel(text='Programming language: '))
        self.lang = PromptTextInput(multiline=False)
        self.add_widget(self.lang)


class PromptLabel(Label):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.color = BLACK

class PromptTextInput(TextInput):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class MiscTextContainer(StackLayout):

    def __init__(self, quantity, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'lr-tb'
        self.size = (MISC_TEXT_BLOCK_WIDTH, MISC_TEXT_BLOCK_HEIGHT)
        self.add_widget(MiscTextEntryCountLabel())
        self.change_misc_text(f'Showing {quantity} entries per page')

    def change_misc_text(self, text):
        self.children[0].text = text


class MiscTextEntryCountLabel(Label):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.color = BLACK
        self.size = (SHOWN_ENTRIES_LABEL_WIDTH, MISC_TEXT_BLOCK_HEIGHT)
        self.size_hint = (None, None)