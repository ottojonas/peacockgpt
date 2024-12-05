from icecream import ic


class InformationLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def load_information(self) -> str:
        with open(self.file_path, "r", encoding="utf-8") as file:
            information = file.read()
        ic("{self.file_path} successfully loaded")
        return information


information_loader = InformationLoader(
    "current-iteration-work/extracted-files/transcribed_pdf.txt"
)
information_loader.load_information()
