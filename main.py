from uvicorn import run

if __name__ == "__main__":
    run(
        "server:app",
        host="127.0.0.1",
        port=49210,
        workers=1
    )
