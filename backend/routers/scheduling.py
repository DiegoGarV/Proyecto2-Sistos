from fastapi import APIRouter, HTTPException
from models.process import Process
from utils.file_loader import load_processes_from_file
from core.scheduler.fifo import simulate_fifo
from core.scheduler.sjf import simulate_sjf
from core.scheduler.srt import simulate_srt
from fastapi import UploadFile, File
from typing import List
import tempfile

router = APIRouter()

stored_processes: List[Process] = [] # memoria temporal para pruebas

@router.post("/simulation-a/upload-processes")
async def upload_processes(file: UploadFile = File(...)):
    # Guardar archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".txt") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        processes = load_processes_from_file(tmp_path)
        global stored_processes
        stored_processes = processes
        return {
            "message": "Procesos cargados correctamente.",
            "processes": [vars(p) for p in processes]
        }
    except Exception as e:
        return {"error": str(e)}
    
@router.get("/simulation-a/fifo")
def run_fifo():
    if not stored_processes:
        return {"error": "No hay procesos cargados."}
    
    result = simulate_fifo(stored_processes)
    return result

@router.get("/simulation-a/sjf")
def run_sjf():
    if not stored_processes:
        return {"error": "No hay procesos cargados."}

    result = simulate_sjf(stored_processes)
    return result

@router.get("/simulation-a/srt")
def run_srt():
    global stored_processes
    if not stored_processes:
        raise HTTPException(status_code=400, detail="No hay procesos cargados.")
    
    result = simulate_srt(stored_processes)
    return result

