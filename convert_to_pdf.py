#!/usr/bin/env python3
"""
Script para converter Markdown para PDF usando fpdf2
"""
import subprocess
import sys
import os
import re
from pathlib import Path

def install_package(package_name):
    """Instala um pacote Python se não estiver instalado"""
    try:
        __import__(package_name.replace('-', '_'))
        return True
    except ImportError:
        print(f"📦 Instalando {package_name}...")
        try:
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", package_name, "-q"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            print(f"✓ {package_name} instalado")
            return True
        except Exception as e:
            print(f"✗ Erro ao instalar {package_name}: {e}")
            return False

def remove_emojis(text):
    """Remove emojis e caracteres especiais do texto"""
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags (iOS)
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "\u2190-\u21FF"  # setas
        "\u2600-\u26FF"  # símbolos diversos
        "]+",
        flags=re.UNICODE,
    )
    text = emoji_pattern.sub(r'', text)
    # Remover caracteres especiais mas manter acentuação
    text = text.replace('←', '').replace('→', '').replace('↓', '')
    return text

def main():
    print("🎨 Convertendo documentação para PDF...\n")
    
    # Verificar dependências
    print("📋 Verificando dependências...")
    
    deps = ['markdown', 'fpdf2']
    for dep in deps:
        install_package(dep)
    
    print("\n✓ Dependências prontas!\n")
    
    # Importar após instalar
    import markdown
    from fpdf import FPDF
    
    # Paths
    md_file = Path("INTERFACE_COMPONENTES.md")
    pdf_file = Path("INTERFACE_COMPONENTES.pdf")
    
    if not md_file.exists():
        print(f"✗ Arquivo {md_file} não encontrado!")
        return False
    
    try:
        # Ler Markdown
        print(f"📖 Lendo {md_file}...")
        with open(md_file, 'r', encoding='utf-8') as f:
            md_content = f.read()
        
        # Remover emojis
        md_content = remove_emojis(md_content)
        
        # Criar PDF
        print("📄 Gerando PDF...")
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", size=11)
        
        # Adicionar título
        pdf.set_font("Helvetica", "B", size=16)
        pdf.set_text_color(0, 123, 255)
        pdf.cell(0, 10, "Interface e Componentes - ADS Event", new_x="LMARGIN", new_y="NEXT")
        pdf.set_text_color(0, 0, 0)
        pdf.set_font("Helvetica", size=10)
        pdf.cell(0, 5, "Desenvolvido por: Iago", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(10)
        
        # Dividir conteúdo em linhas e processar
        lines = md_content.split('\n')
        
        for line in lines:
            line = line.strip()
            
            if not line:
                pdf.ln(3)
                continue
            
            # Títulos principais
            if line.startswith('# '):
                pdf.add_page()
                pdf.set_font("Helvetica", "B", size=14)
                pdf.set_text_color(0, 56, 179)
                text = line.replace('# ', '').strip()[:80]
                pdf.cell(0, 8, text, new_x="LMARGIN", new_y="NEXT")
                pdf.set_text_color(0, 0, 0)
                pdf.set_font("Helvetica", size=10)
                pdf.ln(2)
                
            # Subtítulos
            elif line.startswith('## '):
                if pdf.get_y() > 250:
                    pdf.add_page()
                pdf.set_font("Helvetica", "B", size=12)
                pdf.set_text_color(0, 123, 255)
                text = line.replace('## ', '').strip()[:75]
                pdf.cell(0, 8, text, new_x="LMARGIN", new_y="NEXT")
                pdf.set_text_color(0, 0, 0)
                pdf.set_font("Helvetica", size=10)
                pdf.ln(1)
                
            # Sub-subtítulos
            elif line.startswith('### '):
                if pdf.get_y() > 270:
                    pdf.add_page()
                pdf.set_font("Helvetica", "B", size=11)
                text = line.replace('### ', '').strip()[:75]
                pdf.cell(0, 7, text, new_x="LMARGIN", new_y="NEXT")
                pdf.set_font("Helvetica", size=10)
                
            # Listas
            elif line.startswith('- ') or line.startswith('* '):
                if pdf.get_y() > 270:
                    pdf.add_page()
                text = line.replace('- ', '').replace('* ', '').strip()
                pdf.cell(5)
                pdf.cell(0, 6, "- " + text[:70], new_x="LMARGIN", new_y="NEXT")
                
            # Texto normal
            elif line:
                if pdf.get_y() > 270:
                    pdf.add_page()
                if len(line) > 85:
                    # Quebra linhas longas
                    words = line.split()
                    current_line = ""
                    for word in words:
                        if len(current_line) + len(word) + 1 <= 85:
                            current_line += word + " "
                        else:
                            if current_line:
                                pdf.cell(0, 6, current_line.strip(), new_x="LMARGIN", new_y="NEXT")
                            current_line = word + " "
                    if current_line:
                        pdf.cell(0, 6, current_line.strip(), new_x="LMARGIN", new_y="NEXT")
                else:
                    pdf.cell(0, 6, line[:85], new_x="LMARGIN", new_y="NEXT")
        
        # Salvar PDF
        pdf.output(str(pdf_file))
        
        # Resultado
        file_size = os.path.getsize(pdf_file) / 1024
        print(f"\n✅ PDF gerado com sucesso!")
        print(f"📍 Arquivo: {pdf_file.absolute()}")
        print(f"📊 Tamanho: {file_size:.1f} KB")
        print(f"\n💡 Dica: Abra o PDF em seu leitor de PDF favorito ou imprima para estudar.")
        
        return True
        
    except Exception as e:
        print(f"\n✗ Erro: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
